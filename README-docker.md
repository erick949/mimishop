# 🐳 MimiShop — Guía de Docker

## Arquitectura

```
Browser
  │
  ▼
┌─────────────────────────────┐
│  Nginx (puerto 80)          │  ← Frontend React + proxy
│  /api/*  →  backend:8000    │
│  /*       →  index.html     │
└─────────────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Django + Gunicorn          │  ← Backend API REST
│  puerto interno 8000        │
└─────────────────────────────┘
    │              │
    ▼              ▼
┌────────┐   ┌────────┐
│  PG 16 │   │ Redis  │  ← Datos y caché
└────────┘   └────────┘
```

## Primer arranque

```bash
# 1. Colocar todos los archivos Docker en la raíz del proyecto
#    (junto a mimishop-frontend/ y servidor_mimishop/)

# 2. Crear y editar .env
make setup
nano .env          # ← llenar SECRET_KEY, POSTGRES_PASSWORD

# 3. Levantar todo
make up

# 4. Crear superusuario de Django
make createsuperuser
```

## Comandos frecuentes

| Comando | Qué hace |
|---------|----------|
| `make up` | Producción: build + arranque en background |
| `make dev` | Desarrollo con hot-reload |
| `make down` | Para todos los contenedores |
| `make logs` | Logs en tiempo real (todos los servicios) |
| `make migrate` | Aplica migraciones de Django |
| `make shell-backend` | Bash dentro del contenedor Django |
| `make shell-db` | Consola psql de PostgreSQL |
| `make clean` | ⚠ Elimina contenedores **y volúmenes** |

## Dónde ver la app

- **Frontend / Admin:** http://localhost
- **Django Admin:** http://localhost/admin/
- **API:** http://localhost/api/

En desarrollo también:
- Backend directo: http://localhost:8000
- Vite dev server: http://localhost:5173

## Ajustes en settings.py de Django

Asegúrate de que tu `settings.py` lea estas variables de entorno:

```python
import os, dj_database_url

SECRET_KEY  = os.environ['SECRET_KEY']
DEBUG       = os.getenv('DEBUG', 'False') == 'True'
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost').split(',')

DATABASES = {'default': dj_database_url.config(env='DATABASE_URL')}

# Archivos estáticos
STATIC_ROOT = '/app/staticfiles'
MEDIA_ROOT  = '/app/media'
```

Paquetes adicionales necesarios:
```
gunicorn
dj-database-url
psycopg2-binary   # o psycopg2 si compilas desde fuente
```
