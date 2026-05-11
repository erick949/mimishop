from django.contrib import admin
from .models import Pedido, DetallePedido, EstadoPedido, HistorialEstadoPedido


@admin.register(EstadoPedido)
class EstadoPedidoAdmin(admin.ModelAdmin):
    list_display = ('id_estado_pedido', 'descripcion')


@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ('id_pedido', 'cliente', 'estado', 'total', 'fecha_creacion')
    list_filter = ('estado',)
    search_fields = ('id_pedido',)


@admin.register(DetallePedido)
class DetallePedidoAdmin(admin.ModelAdmin):
    list_display = ('pedido', 'producto', 'cantidad', 'subtotal')


@admin.register(HistorialEstadoPedido)
class HistorialAdmin(admin.ModelAdmin):
    list_display = ('pedido', 'estado', 'usuario', 'fecha_cambio')