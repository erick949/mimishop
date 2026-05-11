from rest_framework import serializers
from .models import Pago, ComisionSocio


class PagoSerializer(serializers.ModelSerializer):
    pedido_id = serializers.CharField(source='pedido.id_pedido', read_only=True)

    class Meta:
        model = Pago
        fields = '__all__'


class ComisionSerializer(serializers.ModelSerializer):
    socio_nombre = serializers.CharField(source='socio.nombre', read_only=True)

    class Meta:
        model = ComisionSocio
        fields = '__all__'