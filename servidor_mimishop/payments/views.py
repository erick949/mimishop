from rest_framework import viewsets
from .models import Pago, ComisionSocio
from .serializers import PagoSerializer, ComisionSerializer


class PagoViewSet(viewsets.ModelViewSet):
    queryset = Pago.objects.all()
    serializer_class = PagoSerializer


class ComisionViewSet(viewsets.ModelViewSet):
    queryset = ComisionSocio.objects.all()
    serializer_class = ComisionSerializer