from rest_framework import viewsets
from .models import Cliente, Telefono, Correo, DireccionCliente
from .serializers import (
    ClienteSerializer,
    TelefonoSerializer,
    CorreoSerializer,
    DireccionSerializer
)


class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer

    # 🔥 SOLUCIÓN AQUÍ
    def perform_destroy(self, instance):
        # 1. eliminar pedidos que dependan de direcciones del cliente
        direcciones = instance.direcciones.all()

        from orders.models import Pedido  # ajusta si es necesario
        Pedido.objects.filter(direccion__in=direcciones).delete()

        # 2. ahora sí eliminar relaciones
        instance.correos.all().delete()
        instance.telefonos.all().delete()
        instance.direcciones.all().delete()

        # 3. eliminar cliente
        instance.delete()


class TelefonoViewSet(viewsets.ModelViewSet):
    queryset = Telefono.objects.all()
    serializer_class = TelefonoSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        cliente_id = self.request.query_params.get('cliente')

        if cliente_id:
            queryset = queryset.filter(cliente_id=cliente_id)

        return queryset


class CorreoViewSet(viewsets.ModelViewSet):
    queryset = Correo.objects.all()
    serializer_class = CorreoSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        cliente_id = self.request.query_params.get('cliente')

        if cliente_id:
            queryset = queryset.filter(cliente_id=cliente_id)

        return queryset


class DireccionViewSet(viewsets.ModelViewSet):
    queryset = DireccionCliente.objects.all()
    serializer_class = DireccionSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        cliente_id = self.request.query_params.get('cliente')

        if cliente_id:
            queryset = queryset.filter(cliente_id=cliente_id)

        return queryset