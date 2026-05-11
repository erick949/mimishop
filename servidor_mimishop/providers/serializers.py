# serializers.py
import uuid
from rest_framework import serializers
from .models import Proveedor, Cupon


class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Proveedor
        fields = '__all__'
        extra_kwargs = {
            'id_proveedor': {'required': False}  # ✅
        }

    def create(self, validated_data):
        validated_data['id_proveedor'] = str(uuid.uuid4())  # ✅
        return super().create(validated_data)


class CuponSerializer(serializers.ModelSerializer):
    proveedor_nombre = serializers.CharField(source='proveedor.nombre', read_only=True)

    class Meta:
        model  = Cupon
        fields = '__all__'
        extra_kwargs = {
            'id_cupon': {'required': False}  # ✅
        }

    def create(self, validated_data):
        validated_data['id_cupon'] = str(uuid.uuid4())  # ✅
        return super().create(validated_data)