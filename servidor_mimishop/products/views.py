from rest_framework import viewsets
from .models import Producto, CategoriaProducto
from .serializers import ProductoSerializer, CategoriaSerializer


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = CategoriaProducto.objects.all()
    serializer_class = CategoriaSerializer


class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer