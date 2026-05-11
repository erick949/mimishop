from django.contrib import admin
from .models import Cliente, Telefono, Correo, DireccionCliente


@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ('id_cliente', 'nombre', 'activo', 'created_at')
    search_fields = ('nombre',)


@admin.register(Telefono)
class TelefonoAdmin(admin.ModelAdmin):
    list_display = ('telefono', 'cliente', 'activo')


@admin.register(Correo)
class CorreoAdmin(admin.ModelAdmin):
    list_display = ('correo', 'cliente', 'activo')


@admin.register(DireccionCliente)
class DireccionClienteAdmin(admin.ModelAdmin):
    list_display = ('cliente', 'ciudad', 'estado', 'cp', 'activo')