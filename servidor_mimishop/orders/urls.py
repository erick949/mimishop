# orders/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PedidoViewSet,
    DetallePedidoViewSet,
    EstadoPedidoViewSet,
    HistorialPedidoViewSet,
    generar_reporte,
)

router = DefaultRouter()
router.register(r'pedidos', PedidoViewSet)
router.register(r'detalles', DetallePedidoViewSet)
router.register(r'estados', EstadoPedidoViewSet)
router.register(r'historial', HistorialPedidoViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('reporte/', generar_reporte, name='generar_reporte'),
]