import uuid
from rest_framework import serializers
from .models import Paquete, EstadoPaquete, HistorialEstadoPaquete


class EstadoPaqueteSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoPaquete
        fields = '__all__'


class HistorialPaqueteSerializer(serializers.ModelSerializer):
    estado_nombre = serializers.CharField(source='estado.descripcion', read_only=True)

    class Meta:
        model = HistorialEstadoPaquete
        fields = '__all__'
        extra_kwargs = {
            'id_historial_paq': {'required': False}
        }

    def create(self, validated_data):
        validated_data['id_historial_paq'] = str(uuid.uuid4())
        return super().create(validated_data)


class PaqueteSerializer(serializers.ModelSerializer):
    estado_nombre = serializers.CharField(source='estado.descripcion', read_only=True)
    proveedor_nombre = serializers.CharField(source='proveedor.nombre', read_only=True)
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    historial_estados = HistorialPaqueteSerializer(many=True, read_only=True)

    class Meta:
        model = Paquete
        fields = '__all__'
        extra_kwargs = {
            'id_paquete': {'required': False},
            'fecha_entrega_proveedor': {'required': False},
        }

    def create(self, validated_data):
        validated_data['id_paquete'] = str(uuid.uuid4())
        return super().create(validated_data)