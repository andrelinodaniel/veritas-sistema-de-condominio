from django.db import models
from django.contrib.auth.models import AbstractUser
import string
import random
class Endereco(models.Model):
    bloco = models.CharField(max_length=5)
    numero = models.CharField(max_length=4)
    codigo_registro = models.CharField(max_length=15, unique=True, null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self,*args,**kwargs):
        if not self.codigo_registro:
            letras_aleatorias = ''.join(random.choices(string.ascii_uppercase+string.digits, k=4))
            self.codigo_registro = f"{self.bloco}{self.numero}-{letras_aleatorias}"

        super().save(*args,**kwargs)
    def __str__(self):
        return f"Bloco {self.bloco} - Apto {self.numero}"
   

class Usuario(AbstractUser):
    cpf = models.CharField(max_length=11, unique=True)
    telefone = models.CharField(max_length=14)
    is_sindico = models.BooleanField(default=False)
    endereco = models.ForeignKey(Endereco,on_delete=models.SET_NULL, null=True)
    updated_at = models.DateTimeField(auto_now=True)


class Chamado(models.Model):
    STATUS_CHOICES = [
        ('aberto', 'Aberto'),
        ('em_andamento', 'Em Andamento'),
        ('concluido', 'Concluído'),
    ]
    PRIORIDADE_CHOICES = [
        ('baixa', 'Baixa'),
        ('media', 'Média'),
        ('alta', 'Alta'),
    ]
    titulo = models.CharField(max_length=30)
    descricao = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES,default='aberto')
    categoria = models.CharField(max_length=50, null=True, blank=True)
    prioridade = models.CharField(max_length=10, choices=PRIORIDADE_CHOICES, null=True, blank=True)
    foto = models.ImageField(upload_to='chamados/', null=True, blank=True)
    autor = models.ForeignKey(Usuario,on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.titulo}"

