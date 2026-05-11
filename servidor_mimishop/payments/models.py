from django.db import models


class Pago(models.Model):
    id_pago = models.CharField(db_column='Id_Pago', primary_key=True, max_length=36)

    pedido = models.ForeignKey(
        'orders.Pedido',
        models.DO_NOTHING,
        db_column='Id_Pedido',
        related_name='pagos'
    )

    monto = models.DecimalField(db_column='Monto', max_digits=10, decimal_places=2, blank=True, null=True)
    metodo = models.CharField(db_column='Metodo', max_length=100, blank=True, null=True)
    referencia = models.CharField(db_column='Referencia', max_length=255, blank=True, null=True)
    fecha_pago = models.DateTimeField(db_column='Fecha_Pago', blank=True, null=True)
    estado = models.CharField(db_column='Estado', max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pago'

    def __str__(self):
        return self.id_pago


class ComisionSocio(models.Model):
    id_comision = models.CharField(db_column='Id_Comision', primary_key=True, max_length=36)

    pedido = models.ForeignKey(
        'orders.Pedido',
        models.DO_NOTHING,
        db_column='Id_Pedido',
        related_name='comisiones'
    )

    socio = models.ForeignKey(
        'users.Socio',
        models.DO_NOTHING,
        db_column='Id_Socio',
        related_name='comisiones'
    )

    monto_comision = models.DecimalField(
        db_column='Monto_Comision',
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True
    )

    estado = models.CharField(db_column='Estado', max_length=50, blank=True, null=True)
    fecha_calculo = models.DateTimeField(db_column='Fecha_Calculo', blank=True, null=True)
    fecha_pago = models.DateTimeField(db_column='Fecha_Pago', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'comision_socio'

    def __str__(self):
        return self.id_comision