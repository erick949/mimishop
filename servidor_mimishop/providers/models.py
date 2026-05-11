from django.db import models


class Proveedor(models.Model):
    id_proveedor = models.CharField(db_column='Id_Proveedor', primary_key=True, max_length=36)
    nombre = models.CharField(db_column='Nombre', max_length=255, blank=True, null=True)
    sitio_web = models.CharField(db_column='SitioWeb', max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'proveedor'

    def __str__(self):
        return self.nombre or self.id_proveedor


class Cupon(models.Model):
    id_cupon = models.CharField(db_column='Id_Cupon', primary_key=True, max_length=36)

    proveedor = models.ForeignKey(
        Proveedor,
        models.DO_NOTHING,
        db_column='Id_Proveedor',
        related_name='cupones'
    )

    codigo = models.CharField(db_column='Codigo', max_length=50, blank=True, null=True)
    descuento_porcentaje = models.DecimalField(
        db_column='Descuento_Porcentaje',
        max_digits=5,
        decimal_places=2,
        blank=True,
        null=True
    )
    fecha_caducidad = models.DateField(db_column='Fecha_Caducidad', blank=True, null=True)
    activo = models.BooleanField(db_column='Activo', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'cupon'

    def __str__(self):
        return self.codigo or self.id_cupon