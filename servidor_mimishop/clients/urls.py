from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClienteViewSet, TelefonoViewSet, CorreoViewSet, DireccionViewSet

router = DefaultRouter()
router.register(r'clientes', ClienteViewSet)
router.register(r'telefonos', TelefonoViewSet)
router.register(r'correos', CorreoViewSet)
router.register(r'direcciones', DireccionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]