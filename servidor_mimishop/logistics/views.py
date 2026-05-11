from rest_framework import viewsets
from .models import Paquete, EstadoPaquete, HistorialEstadoPaquete
from .serializers import (
    PaqueteSerializer,
    EstadoPaqueteSerializer,
    HistorialPaqueteSerializer
)


class PaqueteViewSet(viewsets.ModelViewSet):
    queryset = Paquete.objects.all()
    serializer_class = PaqueteSerializer


class EstadoPaqueteViewSet(viewsets.ModelViewSet):
    queryset = EstadoPaquete.objects.all()
    serializer_class = EstadoPaqueteSerializer


class HistorialPaqueteViewSet(viewsets.ModelViewSet):
    queryset = HistorialEstadoPaquete.objects.all()
    serializer_class = HistorialPaqueteSerializer