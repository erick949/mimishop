from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaqueteViewSet, EstadoPaqueteViewSet, HistorialPaqueteViewSet

router = DefaultRouter()
router.register(r'paquetes', PaqueteViewSet)
router.register(r'estados', EstadoPaqueteViewSet)
router.register(r'historial', HistorialPaqueteViewSet)

urlpatterns = [
    path('', include(router.urls)),
]