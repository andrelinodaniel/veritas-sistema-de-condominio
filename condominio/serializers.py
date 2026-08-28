from rest_framework import serializers
from .models import Usuario, Chamado

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id','username','cpf','telefone','is_sindico','endereco']
        depth = 1

class ChamadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chamado
        fields = ['id', 'titulo', 'descricao', 'status', 'autor', 'created_at']
        depth = 1
        read_only_fields = ['autor']