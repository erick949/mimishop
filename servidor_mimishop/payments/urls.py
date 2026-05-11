from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PagoViewSet, ComisionViewSet

router = DefaultRouter()
router.register(r'pagos', PagoViewSet)
router.register(r'comisiones', ComisionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]