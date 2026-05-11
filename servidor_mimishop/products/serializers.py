import uuid
from rest_framework import serializers
from .models import Producto, CategoriaProducto


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model  = CategoriaProducto
        fields = '__all__'
        extra_kwargs = {
            'id_categoria': {'required': False}
        }

    def create(self, validated_data):
        validated_data['id_categoria'] = str(uuid.uuid4())
        return super().create(validated_data)


class ProductoSerializer(serializers.ModelSerializer):
    categoria = serializers.PrimaryKeyRelatedField(
        queryset=CategoriaProducto.objects.all()
    )

    class Meta:
        model = Producto
        fields = '__all__'
        extra_kwargs = {
            'id_producto': {'required': False}
        }

    def create(self, validated_data):
        validated_data['id_producto'] = str(uuid.uuid4())
        return super().create(validated_data)