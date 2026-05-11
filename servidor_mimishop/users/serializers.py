import uuid
from rest_framework import serializers
from .models import Usuario, Socio


class SocioSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Socio
        fields = '__all__'
        extra_kwargs = {
            'id_socio': {'required': False}
        }

    def create(self, validated_data):
        validated_data['id_socio'] = str(uuid.uuid4())
        return super().create(validated_data)


class UsuarioSerializer(serializers.ModelSerializer):
    socio = SocioSerializer(read_only=True)

    class Meta:
        model  = Usuario
        fields = '__all__'
        extra_kwargs = {
            'id_usuario': {'required': False}
        }

    def create(self, validated_data):
        validated_data['id_usuario'] = str(uuid.uuid4())
        return super().create(validated_data)