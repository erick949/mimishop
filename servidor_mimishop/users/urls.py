from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, SocioViewSet, login_view

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'socios', SocioViewSet)

urlpatterns = [
    path('login/', login_view),  # 👈 AÑADE ESTO
    path('', include(router.urls)),
]