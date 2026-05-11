# views.py
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Usuario, Socio
from .serializers import UsuarioSerializer, SocioSerializer

import jwt
import datetime
from django.conf import settings


@api_view(['POST'])
def login_view(request):
    usuario = request.data.get('usuario')
    password = request.data.get('password')

    if not usuario or not password:
        return Response({'error': 'Faltan datos'}, status=400)

    try:
        user = Usuario.objects.get(usuario=usuario, activo=True)
    except Usuario.DoesNotExist:
        return Response({'error': 'Usuario no existe'}, status=400)

    if user.password != password:
        return Response({'error': 'Contraseña incorrecta'}, status=400)

    # ✅ Generar JWT manualmente
    payload = {
        'id': user.id_usuario,
        'usuario': user.usuario,
        'nivel_acceso': user.nivel_acceso,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=8),
        'iat': datetime.datetime.utcnow(),
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

    return Response({
        'message': 'Login exitoso',
        'usuario': user.usuario,
        'id': user.id_usuario,
        'token': token,
    })


class SocioViewSet(viewsets.ModelViewSet):
    queryset = Socio.objects.all()
    serializer_class = SocioSerializer


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer