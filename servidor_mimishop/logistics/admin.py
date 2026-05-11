from django.contrib import admin
from .models import Paquete, EstadoPaquete, HistorialEstadoPaquete


@admin.register(EstadoPaquete)
class EstadoPaqueteAdmin(admin.ModelAdmin):
    list_display = ('id_estado_paquete', 'descripcion')


@admin.register(Paquete)
class PaqueteAdmin(admin.ModelAdmin):
    list_display = ('id_paquete', 'producto', 'proveedor', 'estado', 'created_at')
    list_filter = ('estado',)


@admin.register(HistorialEstadoPaquete)
class HistorialPaqueteAdmin(admin.ModelAdmin):
    list_display = ('paquete', 'estado', 'usuario', 'fecha_cambio')