from django.contrib import admin
from .models import Proveedor, Cupon


@admin.register(Proveedor)
class ProveedorAdmin(admin.ModelAdmin):
    list_display = ('id_proveedor', 'nombre', 'sitio_web', 'created_at')
    search_fields = ('nombre',)


@admin.register(Cupon)
class CuponAdmin(admin.ModelAdmin):
    list_display = ('codigo', 'proveedor', 'descuento_porcentaje', 'fecha_caducidad', 'activo')
    search_fields = ('codigo',)
    list_filter = ('activo',)