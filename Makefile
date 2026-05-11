# ═══════════════════════════════════════════════════════════
#  MimiShop — Makefile de operaciones
#  Uso: make <comando>
# ═══════════════════════════════════════════════════════════

.PHONY: help setup up down dev logs shell-backend shell-db \
        migrate createsuperuser collectstatic restart clean

# ── Colores ───────────────────────────────────────────────
GREEN  := \033[0;32m
YELLOW := \033[1;33m
RESET  := \033[0m

help:  ## Mostrar esta ayuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(RESET) %s\n", $$1, $$2}'

# ─────────────────────────────────────────────────────────
#  Configuración inicial
# ─────────────────────────────────────────────────────────
setup:  ## Preparar .env desde .env.example
	@if [ ! -f .env ]; then \
	  cp .env.example .env; \
	  echo "$(YELLOW)⚠  Archivo .env creado. Edítalo antes de continuar.$(RESET)"; \
	else \
	  echo "$(GREEN)✔  .env ya existe.$(RESET)"; \
	fi

# ─────────────────────────────────────────────────────────
#  Producción
# ─────────────────────────────────────────────────────────
up:  ## Levantar todos los servicios (producción)
	docker compose up -d --build

down:  ## Detener y eliminar contenedores
	docker compose down

restart:  ## Reiniciar todos los servicios
	docker compose restart

logs:  ## Ver logs en tiempo real
	docker compose logs -f

logs-backend:  ## Logs solo del backend
	docker compose logs -f backend

logs-frontend:  ## Logs solo del frontend
	docker compose logs -f frontend

# ─────────────────────────────────────────────────────────
#  Desarrollo (hot-reload)
# ─────────────────────────────────────────────────────────
dev:  ## Levantar entorno de desarrollo
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# ─────────────────────────────────────────────────────────
#  Django management
# ─────────────────────────────────────────────────────────
migrate:  ## Aplicar migraciones de Django
	docker compose exec backend python manage.py migrate

makemigrations:  ## Crear nuevas migraciones
	docker compose exec backend python manage.py makemigrations

createsuperuser:  ## Crear superusuario de Django
	docker compose exec backend python manage.py createsuperuser

collectstatic:  ## Recolectar archivos estáticos
	docker compose exec backend python manage.py collectstatic --noinput

shell-backend:  ## Shell dentro del contenedor backend
	docker compose exec backend bash

shell-db:  ## Conectarse a PostgreSQL
	docker compose exec db psql -U $${POSTGRES_USER:-mimishop_user} -d $${POSTGRES_DB:-mimishop}

# ─────────────────────────────────────────────────────────
#  Limpieza
# ─────────────────────────────────────────────────────────
clean:  ## Eliminar contenedores, redes y volúmenes (¡borra datos!)
	@echo "$(YELLOW)⚠  Esto eliminará TODOS los datos. Confirmar con ENTER o Ctrl+C para cancelar.$(RESET)"
	@read _
	docker compose down -v --remove-orphans
