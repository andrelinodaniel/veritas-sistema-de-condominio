from django.db import models
from django.contrib.auth.models import AbstractUser

class Endereco(models.Model):
    bloco = models.CharField(max_length=5)
    numero = models.CharField(max_length=4)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Usuario(AbstractUser):
    cpf = models.CharField(max_length=11)
    telefone = models.CharField(max_length=14)
    is_sindico = models.BooleanField(default=False)
    endereco = models.ForeignKey(Endereco,on_delete=models.SET_NULL, null=True)
    updated_at = models.DateTimeField(auto_now=True)


class Chamado(models.Model):
    titulo = models.CharField(max_length=30)
    descricao = models.TextField()
    status = models.CharField(max_length=20)
    autor = models.ForeignKey(Usuario,on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

