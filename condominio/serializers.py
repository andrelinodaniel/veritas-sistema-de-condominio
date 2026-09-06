from rest_framework import serializers
from .models import Usuario, Chamado, Endereco

class EnderecoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Endereco
        fields = ['id', 'bloco', 'numero', 'codigo_registro', 'created_at']
        read_only_fields = ['codigo_registro']

class UsuarioSerializer(serializers.ModelSerializer):
    codigo_registro = serializers.CharField(write_only=True, required=True)
    class Meta:
        model = Usuario
        fields = ['id','username','first_name', 'last_name','cpf','telefone','is_sindico','endereco','codigo_registro','password']
        depth = 1
        extra_kwargs = {
            'password':{'write_only':True},
            'username':{'required':False}
        }
        read_only_fields = ['is_sindico', 'is_staff', 'is_superuser', 'is_active']
    def create(self,validated_data):
        codigo = validated_data.pop('codigo_registro',None)
        senha = validated_data.pop('password',None)
        validated_data['username'] = validated_data.get('cpf')
        
        if senha:
            from django.contrib.auth.password_validation import validate_password
            from django.core.exceptions import ValidationError as DjangoValidationError
            try:
                validate_password(senha)
            except DjangoValidationError as e:
                raise serializers.ValidationError({"password": list(e.messages)})
        from .models import Endereco
        casa_encontrada = Endereco.objects.filter(codigo_registro = codigo).first()
        if not casa_encontrada:
            raise serializers.ValidationError({"codigo_registro": "Codigo de apartamento inválido!"})
        usuario = Usuario.objects.create(**validated_data,endereco=casa_encontrada)
        if senha:
            usuario.set_password(senha)
            usuario.save()
        return usuario


class ChamadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chamado
        fields = ['id', 'titulo', 'descricao', 'status', 'autor', 'created_at']
        depth = 1
        read_only_fields = ['autor']