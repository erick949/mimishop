from django.contrib import admin
from .models import Producto, CategoriaProducto


@admin.register(CategoriaProducto)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('id_categoria', 'nombre')
    search_fields = ('nombre',)


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'categoria', 'proveedor', 'precio', 'activo')
    search_fields = ('nombre',)
    list_filter = ('activo', 'categoria')