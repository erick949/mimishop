from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProveedorViewSet, CuponViewSet

router = DefaultRouter()
router.register(r'proveedores', ProveedorViewSet)
router.register(r'cupones', CuponViewSet)

urlpatterns = [
    path('', include(router.urls)),
]