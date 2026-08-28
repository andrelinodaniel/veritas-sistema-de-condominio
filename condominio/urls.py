from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, ChamadoViewSet


router = DefaultRouter()

router.register('usuarios',UsuarioViewSet)
router.register('chamados',ChamadoViewSet)

urlpatterns = [
    path('',include(router.urls))
]