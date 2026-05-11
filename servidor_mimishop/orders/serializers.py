from rest_framework import serializers
from .models import Pedido, DetallePedido, EstadoPedido, HistorialEstadoPedido
import uuid


class EstadoPedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoPedido
        fields = '__all__'


class DetallePedidoSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)

    class Meta:
        model = DetallePedido
        fields = '__all__'
        extra_kwargs = {
            'id_detalle': {'required': False}
        }

    def create(self, validated_data):
        validated_data['id_detalle'] = str(uuid.uuid4())
        return super().create(validated_data)


class HistorialSerializer(serializers.ModelSerializer):
    estado_nombre = serializers.CharField(source='estado.descripcion', read_only=True)

    class Meta:
        model = HistorialEstadoPedido
        fields = '__all__'


class PedidoSerializer(serializers.ModelSerializer):
    detalles = DetallePedidoSerializer(many=True, read_only=True)
    historial_estados = HistorialSerializer(many=True, read_only=True)
    estado_nombre = serializers.CharField(source='estado.descripcion', read_only=True)
    cliente_nombre    = serializers.CharField(source='cliente.nombre', read_only=True)  # añadir
    socio_nombre      = serializers.CharField(source='socio.nombre', read_only=True)    # añadir si falta

    class Meta:
        model = Pedido
        fields = '__all__'
        extra_kwargs = {
            'id_pedido': {'required': False}
        }

    def create(self, validated_data):
        validated_data['id_pedido'] = str(uuid.uuid4())
        return super().create(validated_data)