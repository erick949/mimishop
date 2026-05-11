from django.contrib import admin
from .models import Usuario, Socio


@admin.register(Socio)
class SocioAdmin(admin.ModelAdmin):
    list_display = ('id_socio', 'nombre', 'porcentaje_comision', 'activo')
    search_fields = ('nombre',)


@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'socio', 'nivel_acceso', 'activo', 'ultimo_login')
    search_fields = ('usuario',)