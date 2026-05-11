"""
Migración MySQL → Supabase (PostgreSQL)
Migra estructura (tablas, índices, claves foráneas) y datos.

Uso:
    pip install mysql-connector-python psycopg2-binary python-dotenv
    python migrate_mysql_to_supabase.py
"""

import os
import re
import sys
import time
import mysql.connector
import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv

load_dotenv()

# ──────────────────────────────────────────────
# CONFIGURACIÓN (lee desde .env)
# ──────────────────────────────────────────────


MYSQL_CFG = {
    "host":     os.getenv("MYSQL_HOST", "localhost"),
    "port":     int(os.getenv("MYSQL_PORT", 3306)),
    "user":     os.getenv("MYSQL_USER"),
    "password": os.getenv("MYSQL_PASSWORD"),
    "database": os.getenv("MYSQL_DB"),
}



PG_CFG = {
    "host":     os.getenv("PG_HOST"),
    "port":     int(os.getenv("PG_PORT", 5432)),
    "user":     os.getenv("PG_USER", "postgres"),
    "password": os.getenv("PG_PASSWORD"),
    "dbname":   os.getenv("PG_DB", "postgres"),
    "sslmode":  "require",           # Supabase exige SSL
}

# ──────────────────────────────────────────────
# MAPEO DE TIPOS MySQL → PostgreSQL
# ──────────────────────────────────────────────
TYPE_MAP = {
    "tinyint":    "smallint",
    "smallint":   "smallint",
    "mediumint":  "integer",
    "int":        "integer",
    "bigint":     "bigint",
    "float":      "real",
    "double":     "double precision",
    "decimal":    "numeric",
    "char":       "char",
    "varchar":    "varchar",
    "tinytext":   "text",
    "text":       "text",
    "mediumtext": "text",
    "longtext":   "text",
    "tinyblob":   "bytea",
    "blob":       "bytea",
    "mediumblob": "bytea",
    "longblob":   "bytea",
    "date":       "date",
    "time":       "time",
    "datetime":   "timestamp",
    "timestamp":  "timestamp",
    "year":       "smallint",
    "boolean":    "boolean",
    "bool":       "boolean",
    "json":       "jsonb",
    "enum":       "text",
    "set":        "text",
}

BATCH_SIZE = 500       # registros por INSERT
LOG_EVERY  = 5_000     # filas antes de imprimir progreso


# ──────────────────────────────────────────────
# HELPERS
# ──────────────────────────────────────────────
def log(msg: str, level: str = "INFO"):
    symbols = {"INFO": "●", "OK": "✔", "WARN": "⚠", "ERR": "✖"}
    print(f"[{symbols.get(level, '·')}] {msg}")


def map_type(mysql_type: str, column_type: str) -> str:
    """Convierte un tipo MySQL al equivalente PostgreSQL."""
    base = mysql_type.lower().split("(")[0].strip()
    pg = TYPE_MAP.get(base, "text")

    # Conservar precisión para numeric/decimal
    if base in ("decimal", "numeric") and "(" in column_type:
        precision = re.search(r"\([\d,\s]+\)", column_type)
        if precision:
            pg = f"numeric{precision.group()}"

    # varchar con longitud
    if base == "varchar" and "(" in column_type:
        length = re.search(r"\((\d+)\)", column_type)
        if length:
            pg = f"varchar({length.group(1)})"

    # char con longitud
    if base == "char" and "(" in column_type:
        length = re.search(r"\((\d+)\)", column_type)
        if length:
            pg = f"char({length.group(1)})"

    return pg


def get_tables(mysql_cur) -> list[str]:
    mysql_cur.execute("SHOW TABLES")
    return [row[0] for row in mysql_cur.fetchall()]


def get_columns(mysql_cur, table: str) -> list[dict]:
    mysql_cur.execute(f"SHOW FULL COLUMNS FROM `{table}`")
    cols = []
    for row in mysql_cur.fetchall():
        cols.append({
            "name":       row[0],
            "type":       row[1],
            "nullable":   row[3] == "YES",
            "key":        row[4],          # PRI, UNI, MUL
            "default":    row[5],
            "extra":      row[6],          # auto_increment, etc.
            "comment":    row[8],
        })
    return cols


def get_foreign_keys(mysql_cur, db: str, table: str) -> list[dict]:
    query = """
        SELECT
            kcu.CONSTRAINT_NAME,
            kcu.COLUMN_NAME,
            kcu.REFERENCED_TABLE_NAME,
            kcu.REFERENCED_COLUMN_NAME,
            rc.UPDATE_RULE,
            rc.DELETE_RULE
        FROM information_schema.KEY_COLUMN_USAGE kcu
        JOIN information_schema.REFERENTIAL_CONSTRAINTS rc
          ON kcu.CONSTRAINT_NAME = rc.CONSTRAINT_NAME
         AND kcu.CONSTRAINT_SCHEMA = rc.CONSTRAINT_SCHEMA
        WHERE kcu.TABLE_SCHEMA = %s
          AND kcu.TABLE_NAME   = %s
          AND kcu.REFERENCED_TABLE_NAME IS NOT NULL
    """
    mysql_cur.execute(query, (db, table))
    fks = []
    for row in mysql_cur.fetchall():
        fks.append({
            "name":        row[0],
            "column":      row[1],
            "ref_table":   row[2],
            "ref_column":  row[3],
            "on_update":   row[4],
            "on_delete":   row[5],
        })
    return fks


def get_indexes(mysql_cur, table: str) -> list[dict]:
    mysql_cur.execute(f"SHOW INDEX FROM `{table}`")
    indexes: dict[str, dict] = {}
    for row in mysql_cur.fetchall():
        name      = row[2]
        non_uniq  = row[1]
        col       = row[4]
        if name == "PRIMARY":
            continue
        if name not in indexes:
            indexes[name] = {"unique": not non_uniq, "columns": []}
        indexes[name]["columns"].append(col)
    return list(indexes.values()) + [{"_name": k, **v} for k, v in indexes.items()][len(indexes):]
    # Simplificado: devolvemos lista limpia
    result = []
    for name, info in indexes.items():
        result.append({"name": name, "unique": info["unique"], "columns": info["columns"]})
    return result


# ──────────────────────────────────────────────
# CREACIÓN DE TABLAS EN POSTGRESQL
# ──────────────────────────────────────────────
def build_create_table(table: str, columns: list[dict]) -> str:
    lines = []
    pk_cols = [c["name"] for c in columns if c["key"] == "PRI"]

    for col in columns:
        pg_type = map_type(col["type"].split("(")[0], col["type"])

        # AUTO_INCREMENT → SERIAL / BIGSERIAL
        if "auto_increment" in col["extra"].lower():
            pg_type = "bigserial" if "bigint" in col["type"].lower() else "serial"

        not_null  = "NOT NULL" if not col["nullable"] else ""
        default   = ""

        if col["default"] is not None and "auto_increment" not in col["extra"].lower():
            val = col["default"]
            if val.upper() in ("CURRENT_TIMESTAMP", "NOW()"):
                default = "DEFAULT now()"
            elif val.upper() == "NULL":
                default = "DEFAULT NULL"
            elif pg_type in ("text", "varchar") or pg_type.startswith("char"):
                default = f"DEFAULT '{val}'"
            else:
                try:
                    float(val)
                    default = f"DEFAULT {val}"
                except ValueError:
                    default = f"DEFAULT '{val}'"

        parts = [f'  "{col["name"]}" {pg_type}', not_null, default]
        lines.append(" ".join(p for p in parts if p).rstrip())

    if pk_cols:
        pk_list = ", ".join(f'"{c}"' for c in pk_cols)
        lines.append(f"  PRIMARY KEY ({pk_list})")

    col_defs = ",\n".join(lines)
    return f'CREATE TABLE IF NOT EXISTS "{table}" (\n{col_defs}\n);'


# ──────────────────────────────────────────────
# MIGRACIÓN DE DATOS
# ──────────────────────────────────────────────
def migrate_data(mysql_cur, pg_cur, pg_conn, table: str, columns: list[dict]):
    col_names = [c["name"] for c in columns]
    placeholders = ", ".join(["%s"] * len(col_names))
    col_list = ", ".join(f'"{c}"' for c in col_names)
    insert_sql = f'INSERT INTO "{table}" ({col_list}) VALUES ({placeholders}) ON CONFLICT DO NOTHING'

    mysql_cur.execute(f"SELECT COUNT(*) FROM `{table}`")
    total = mysql_cur.fetchone()[0]
    if total == 0:
        log(f"  {table}: tabla vacía, omitida.", "WARN")
        return

    log(f"  {table}: migrando {total:,} filas...")
    mysql_cur.execute(f"SELECT {', '.join(f'`{c}`' for c in col_names)} FROM `{table}`")

    batch = []
    migrated = 0
    t0 = time.time()

    while True:
        rows = mysql_cur.fetchmany(BATCH_SIZE)
        if not rows:
            break
        batch.extend(rows)

        if len(batch) >= BATCH_SIZE:
            pg_cur.executemany(insert_sql, batch)
            pg_conn.commit()
            migrated += len(batch)
            batch = []
            if migrated % LOG_EVERY < BATCH_SIZE:
                elapsed = time.time() - t0
                log(f"    {migrated:,}/{total:,} ({migrated/total*100:.1f}%) — {elapsed:.1f}s")

    if batch:
        pg_cur.executemany(insert_sql, batch)
        pg_conn.commit()
        migrated += len(batch)

    elapsed = time.time() - t0
    log(f"  {table}: {migrated:,} filas migradas en {elapsed:.1f}s ✔", "OK")


# ──────────────────────────────────────────────
# MAIN
# ──────────────────────────────────────────────
def main():
    # Conexiones
    log("Conectando a MySQL...")
    try:
        my_conn = mysql.connector.connect(**MYSQL_CFG)
        my_cur  = my_conn.cursor()
        log("MySQL: conectado ✔", "OK")
    except Exception as e:
        log(f"Error conectando a MySQL: {e}", "ERR"); sys.exit(1)

    log("Conectando a Supabase (PostgreSQL)...")
    try:
        pg_conn = psycopg2.connect(**PG_CFG)
        pg_cur  = pg_conn.cursor()
        log("Supabase: conectado ✔", "OK")
    except Exception as e:
        log(f"Error conectando a Supabase: {e}", "ERR"); sys.exit(1)

    tables = get_tables(my_cur)
    log(f"\nTablas encontradas: {len(tables)} → {', '.join(tables)}\n")

    # ── FASE 1: Crear tablas (sin FK para evitar dependencias circulares)
    log("═" * 50)
    log("FASE 1: Creando estructura de tablas")
    log("═" * 50)

    table_columns: dict[str, list[dict]] = {}
    for table in tables:
        cols = get_columns(my_cur, table)
        table_columns[table] = cols
        ddl = build_create_table(table, cols)
        try:
            pg_cur.execute(ddl)
            pg_conn.commit()
            log(f"  {table}: tabla creada ✔", "OK")
        except Exception as e:
            pg_conn.rollback()
            log(f"  {table}: ERROR al crear — {e}", "ERR")

    # ── FASE 2: Migrar datos
    log("\n" + "═" * 50)
    log("FASE 2: Migrando datos")
    log("═" * 50)

    for table in tables:
        migrate_data(my_cur, pg_cur, pg_conn, table, table_columns[table])

    # ── FASE 3: Crear índices
    log("\n" + "═" * 50)
    log("FASE 3: Creando índices")
    log("═" * 50)

    for table in tables:
        try:
            my_cur.execute(f"SHOW INDEX FROM `{table}`")
            indexes: dict[str, dict] = {}
            for row in my_cur.fetchall():
                name, non_uniq, col = row[2], row[1], row[4]
                if name == "PRIMARY":
                    continue
                if name not in indexes:
                    indexes[name] = {"unique": not non_uniq, "columns": []}
                indexes[name]["columns"].append(col)

            for idx_name, info in indexes.items():
                unique = "UNIQUE" if info["unique"] else ""
                cols   = ", ".join(f'"{c}"' for c in info["columns"])
                safe_name = f'idx_{table}_{idx_name}'[:63]
                ddl = f'CREATE {unique} INDEX IF NOT EXISTS "{safe_name}" ON "{table}" ({cols});'
                try:
                    pg_cur.execute(ddl)
                    pg_conn.commit()
                    log(f"  {table}.{idx_name}: índice creado ✔", "OK")
                except Exception as e:
                    pg_conn.rollback()
                    log(f"  {table}.{idx_name}: WARN — {e}", "WARN")
        except Exception as e:
            log(f"  {table}: error leyendo índices — {e}", "WARN")

    # ── FASE 4: Crear claves foráneas
    log("\n" + "═" * 50)
    log("FASE 4: Creando claves foráneas")
    log("═" * 50)

    for table in tables:
        fks = get_foreign_keys(my_cur, MYSQL_CFG["database"], table)
        for fk in fks:
            safe_name = f'fk_{table}_{fk["name"]}'[:63]
            ddl = (
                f'ALTER TABLE "{table}" '
                f'ADD CONSTRAINT "{safe_name}" '
                f'FOREIGN KEY ("{fk["column"]}") '
                f'REFERENCES "{fk["ref_table"]}" ("{fk["ref_column"]}") '
                f'ON UPDATE {fk["on_update"]} ON DELETE {fk["on_delete"]};'
            )
            try:
                pg_cur.execute(ddl)
                pg_conn.commit()
                log(f"  {table} → {fk['ref_table']}: FK creada ✔", "OK")
            except Exception as e:
                pg_conn.rollback()
                log(f"  {table}: FK WARN — {e}", "WARN")

    # Cierre
    my_cur.close();  my_conn.close()
    pg_cur.close();  pg_conn.close()

    log("\n" + "═" * 50)
    log("¡Migración completada! Revisa los WARN si los hay.", "OK")
    log("═" * 50)


if __name__ == "__main__":
    main()
