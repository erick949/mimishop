from django.db import models


class Socio(models.Model):
    id_socio = models.CharField(db_column='Id_Socio', primary_key=True, max_length=36)
    nombre = models.CharField(db_column='Nombre', max_length=255, blank=True, null=True)
    porcentaje_comision = models.DecimalField(db_column='Porcentaje_Comision', max_digits=5, decimal_places=2, blank=True, null=True)
    activo = models.BooleanField(db_column='Activo', blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'socio'

    def __str__(self):
        return self.nombre or self.id_socio


class Usuario(models.Model):
    id_usuario = models.CharField(db_column='Id_Usuario', primary_key=True, max_length=36)
    socio = models.ForeignKey(
        Socio,
        models.DO_NOTHING,
        db_column='Id_Socio',
        related_name='usuarios'
    )
    usuario = models.CharField(db_column='Usuario', max_length=100, blank=True, null=True)
    password = models.CharField(db_column='Password', max_length=255, blank=True, null=True)
    nivel_acceso = models.IntegerField(db_column='Nivel_Acceso', blank=True, null=True)
    activo = models.BooleanField(db_column='Activo', blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    ultimo_login = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'usuario'

    def __str__(self):
        return self.usuario or self.id_usuario