from rest_framework import viewsets
from .permissions import EhAutenticado, IsSindico
from .models import Usuario, Chamado
from .serializers import UsuarioSerializer, ChamadoSerializer


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [EhAutenticado,IsSindico]

class ChamadoViewSet(viewsets.ModelViewSet):
    serializer_class = ChamadoSerializer
    permission_classes = [EhAutenticado,IsSindico]

    def get_queryset(self):
        if self.request.user.is_sindico == True:
            return Chamado.objects.all()

        return Chamado.objects.filter(autor=self.request.user)

    def perform_create(self, serializer):
        serializer.save(autor=self.request.user)
