import uuid
from django.db import models
from django.utils import timezone


class Cliente(models.Model):
    id_cliente = models.CharField(db_column='Id_Cliente', primary_key=True, max_length=36)
    nombre = models.CharField(db_column='Nombre', max_length=255, blank=True, null=True)
    activo = models.BooleanField(db_column='Activo', blank=True, null=True)

    # 👇 CAMBIO CLAVE
    created_at = models.DateTimeField(blank=True, null=True, default=timezone.now)
    updated_at = models.DateTimeField(blank=True, null=True, default=timezone.now)
    
    class Meta:
        managed = False
        db_table = 'cliente'

    def save(self, *args, **kwargs):
        # 👇 asegura comportamiento correcto siempre
        if not self.created_at:
            self.created_at = timezone.now()

        self.updated_at = timezone.now()

        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre or self.id_cliente
    

class Telefono(models.Model):
    id_telefono = models.CharField(db_column='Id_Telefono', primary_key=True, max_length=36)
    cliente = models.ForeignKey(
        Cliente,
        models.DO_NOTHING,
        db_column='Id_Cliente',
        related_name='telefonos'
    )
    telefono = models.CharField(db_column='Telefono', max_length=20, blank=True, null=True)
    activo = models.BooleanField(db_column='Activo', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'telefono'


class Correo(models.Model):
    id_correo = models.CharField(db_column='Id_Correo', primary_key=True, max_length=36)
    cliente = models.ForeignKey(
        Cliente,
        models.DO_NOTHING,
        db_column='Id_Cliente',
        related_name='correos'
    )
    correo = models.CharField(db_column='Correo', max_length=255, blank=True, null=True)
    activo = models.BooleanField(db_column='Activo', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'correo'


class DireccionCliente(models.Model):
    id_direccion = models.CharField(db_column='Id_Direccion', primary_key=True, max_length=36)
    cliente = models.ForeignKey(
        Cliente,
        models.DO_NOTHING,
        db_column='Id_Cliente',
        related_name='direcciones'
    )
    calle = models.CharField(db_column='Calle', max_length=255, blank=True, null=True)
    ciudad = models.CharField(db_column='Ciudad', max_length=100, blank=True, null=True)
    estado = models.CharField(db_column='Estado', max_length=100, blank=True, null=True)
    cp = models.CharField(db_column='CP', max_length=10, blank=True, null=True)
    activo = models.BooleanField(db_column='Activo', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'direccion_cliente'