from django.contrib import admin
from .models import Pago, ComisionSocio


@admin.register(Pago)
class PagoAdmin(admin.ModelAdmin):
    list_display = ('id_pago', 'pedido', 'monto', 'metodo', 'estado', 'fecha_pago')
    list_filter = ('estado', 'metodo')


@admin.register(ComisionSocio)
class ComisionAdmin(admin.ModelAdmin):
    list_display = ('id_comision', 'pedido', 'socio', 'monto_comision', 'estado')
    list_filter = ('estado',)