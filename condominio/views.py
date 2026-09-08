from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .permissions import EhAutenticado, IsSindico
from .models import Usuario, Chamado, Endereco
from .serializers import UsuarioSerializer, ChamadoSerializer, EnderecoSerializer

class EnderecoViewSet(viewsets.ModelViewSet):
    queryset = Endereco.objects.all()
    serializer_class = EnderecoSerializer
    permission_classes = [EhAutenticado, IsSindico]

class UsuarioViewSet(viewsets.ModelViewSet):
    serializer_class = UsuarioSerializer
    
    def get_queryset(self):
        # Retorna apenas os moradores reais (ignora síndico e admin do Django)
        return Usuario.objects.filter(is_sindico=False, is_staff=False, is_superuser=False)
    permission_classes = [EhAutenticado,IsSindico]
    def get_permissions(self):
        if self.action == 'create':
            
            return [AllowAny()]
        return super().get_permissions()
        

class ChamadoViewSet(viewsets.ModelViewSet):
    serializer_class = ChamadoSerializer
    permission_classes = [EhAutenticado,IsSindico]
    def get_permissions(self):
        if self.action in ['create','list','retrieve']:
            return [EhAutenticado()]
        return super().get_permissions()
    def get_queryset(self):
        if self.request.user.is_sindico or self.request.user.is_staff  == True:
            return Chamado.objects.all()

        return Chamado.objects.filter(autor=self.request.user)

    def perform_create(self, serializer):
        serializer.save(autor=self.request.user) 
class DashboardView(APIView):
    permission_classes = [EhAutenticado,IsSindico]
    def get(self,request):
        total_moradores = Usuario.objects.filter(is_sindico=False, is_staff=False, is_superuser=False).count()
        chamados_abertos = Chamado.objects.filter(status='aberto').count()
        chamados_andamento = Chamado.objects.filter(status='em_andamento').count()
        chamados_concluidos = Chamado.objects.filter(status='concluido').count()

        dados = {'total_moradores':total_moradores,'chamados_abertos':chamados_abertos,'chamados_andamento':chamados_andamento,'chamados_concluidos':chamados_concluidos,}

        return Response(dados)



