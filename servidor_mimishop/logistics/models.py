from django.db import models


class EstadoPaquete(models.Model):
    id_estado_paquete = models.CharField(db_column='Id_EstadoPaquete', primary_key=True, max_length=36)
    descripcion = models.CharField(db_column='Descripcion', max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'estado_paquete'

    def __str__(self):
        return self.descripcion or self.id_estado_paquete


class Paquete(models.Model):
    id_paquete = models.CharField(db_column='Id_Paquete', primary_key=True, max_length=36)

    producto = models.ForeignKey(
        'products.Producto',
        models.DO_NOTHING,
        db_column='Id_Producto',
        related_name='paquetes'
    )

    proveedor = models.ForeignKey(
        'providers.Proveedor',
        models.DO_NOTHING,
        db_column='Id_Proveedor',
        related_name='paquetes'
    )

    estado = models.ForeignKey(
        EstadoPaquete,
        models.DO_NOTHING,
        db_column='Id_EstadoPaquete',
        related_name='paquetes'
    )

    codigo_activacion = models.CharField(db_column='Codigo_Activacion', max_length=100, blank=True, null=True)
    fecha_pedido_proveedor = models.DateField(db_column='Fecha_Pedido_Proveedor', blank=True, null=True)
    fecha_entrega_proveedor = models.DateField(db_column='Fecha_Entrega_Proveedor', blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False

        db_table = 'paquete'

    def __str__(self):
        return self.id_paquete
    
class HistorialEstadoPaquete(models.Model):
    id_historial_paq = models.CharField(db_column='Id_HistorialPaq', primary_key=True, max_length=36)

    paquete = models.ForeignKey(
        Paquete,
        models.DO_NOTHING,
        db_column='Id_Paquete',
        related_name='historial_estados'
    )

    estado = models.ForeignKey(
        EstadoPaquete,
        models.DO_NOTHING,
        db_column='Id_EstadoPaquete'
    )

    usuario = models.ForeignKey(
        'users.Usuario',
        models.DO_NOTHING,
        db_column='Id_Usuario'
    )

    fecha_cambio = models.DateTimeField(db_column='Fecha_Cambio', blank=True, null=True)
    nota = models.TextField(db_column='Nota', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'historial_estado_paquete'