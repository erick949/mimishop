import uuid

from rest_framework import serializers
from .models import Cliente, Telefono, Correo, DireccionCliente

class TelefonoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Telefono
        fields = '__all__'
        extra_kwargs = {'id_telefono': {'required': False}}

    def create(self, validated_data):
        validated_data['id_telefono'] = str(uuid.uuid4())
        return super().create(validated_data)


class CorreoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Correo
        fields = '__all__'
        extra_kwargs = {'id_correo': {'required': False}}

    def create(self, validated_data):
        validated_data['id_correo'] = str(uuid.uuid4())
        return super().create(validated_data)


class DireccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DireccionCliente
        fields = '__all__'
        extra_kwargs = {'id_direccion': {'required': False}}

    def create(self, validated_data):
        validated_data['id_direccion'] = str(uuid.uuid4())
        return super().create(validated_data)
    
    
class ClienteSerializer(serializers.ModelSerializer):
    telefonos  = TelefonoSerializer(many=True, read_only=True)
    correos    = CorreoSerializer(many=True, read_only=True)
    direcciones = DireccionSerializer(many=True, read_only=True)

    class Meta:
        model  = Cliente
        fields = '__all__'
        extra_kwargs = {
            'id_cliente': {'required': False}  
        }

    def create(self, validated_data):
        validated_data['id_cliente'] = str(uuid.uuid4())  
        return super().create(validated_data)