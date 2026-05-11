import uuid
from datetime import date
from django.db import models
from django.utils import timezone

def generate_uuid_str():
    return str(uuid.uuid4())

class EstadoPedido(models.Model):
    id_estado_pedido = models.CharField(db_column='Id_EstadoPedido', primary_key=True, max_length=36)
    descripcion = models.CharField(db_column='Descripcion', max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'estado_pedido'

    def __str__(self):
        return self.descripcion or self.id_estado_pedido


class Pedido(models.Model):
    id_pedido = models.CharField(
        db_column='Id_Pedido',
        primary_key=True,
        max_length=36,
        default=generate_uuid_str
    )

    cliente = models.ForeignKey(
        'clients.Cliente',
        models.DO_NOTHING,
        db_column='Id_Cliente',
        related_name='pedidos'
    )

    socio = models.ForeignKey(
        'users.Socio',
        models.DO_NOTHING,
        db_column='Id_Socio',
        related_name='pedidos'
    )

    direccion = models.ForeignKey(
        'clients.DireccionCliente',
        models.CASCADE,
        db_column='Id_Direccion',
        related_name='pedidos',
        null=True,
        blank=True
    )

    cupon = models.ForeignKey(
        'providers.Cupon',
        models.DO_NOTHING,
        db_column='Id_Cupon',
        blank=True,
        null=True,
        related_name='pedidos'
    )

    estado = models.ForeignKey(
        EstadoPedido,
        models.DO_NOTHING,
        db_column='Id_EstadoPedido',
        related_name='pedidos',
        null=True,
        blank=True
    )

    fecha_creacion = models.DateField(
        db_column='Fecha_Creacion',
        blank=True,
        null=True,
        default=date.today
    )

    fecha_entrega = models.DateField(
        db_column='Fecha_Entrega',
        blank=True,
        null=True
    )

    total = models.DecimalField(
        db_column='Total',
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        blank=True,
        null=True,
        default=timezone.now
    )

    class Meta:
        managed = False
        db_table = 'pedido'

    def save(self, *args, **kwargs):
        is_new = not self.pk

        # 📅 Fechas automáticas
        if not self.fecha_creacion:
            self.fecha_creacion = date.today()

        if not self.created_at:
            self.created_at = timezone.now()

        # 📌 Estado por defecto (SOLICITADO)
        if not self.estado_id:
            self.estado_id = '39948c1b-41b1-11f1-8771-0a0027000013'

        super().save(*args, **kwargs)

        # 🧾 HISTORIAL AUTOMÁTICO
        from .models import HistorialEstadoPedido  # evita import circular

        if is_new:
            # 👉 al crear pedido
            HistorialEstadoPedido.objects.create(
                id_historial=str(uuid.uuid4()),
                pedido=self,
                estado=self.estado,
                usuario_id=self.socio_id,  # o cámbialo si tienes usuario real
                fecha_cambio=timezone.now(),
                nota='Pedido creado'
            )
        else:
            # 👉 detectar cambio de estado
            old = Pedido.objects.filter(pk=self.pk).first()
            if old and old.estado_id != self.estado_id:
                HistorialEstadoPedido.objects.create(
                    id_historial=str(uuid.uuid4()),
                    pedido=self,
                    estado=self.estado,
                    usuario_id=self.socio_id,
                    fecha_cambio=timezone.now(),
                    nota='Cambio de estado'
                )

    def __str__(self):
        return self.id_pedido


class DetallePedido(models.Model):
    id_detalle = models.CharField(
        db_column='Id_Detalle',
        primary_key=True,
        max_length=36,
        default=generate_uuid_str
    )

    pedido = models.ForeignKey(
        Pedido,
        models.CASCADE,
        db_column='Id_Pedido',
        related_name='detalles'
    )

    producto = models.ForeignKey(
        'products.Producto',
        models.DO_NOTHING,
        db_column='Id_Producto',
        related_name='detalles'
    )

    cantidad = models.IntegerField(db_column='Cantidad', blank=True, null=True)

    precio_unitario = models.DecimalField(
        db_column='PrecioUnitario',
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True
    )

    subtotal = models.DecimalField(
        db_column='Subtotal',
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True
    )

    class Meta:
        managed = False
        db_table = 'detalle_pedido'


class HistorialEstadoPedido(models.Model):
    id_historial = models.CharField(
        db_column='Id_Historial',
        primary_key=True,
        max_length=36,
        default=generate_uuid_str
    )

    pedido = models.ForeignKey(
        Pedido,
        models.CASCADE,
        db_column='Id_Pedido',
        related_name='historial_estados'
    )

    estado = models.ForeignKey(
        EstadoPedido,
        models.DO_NOTHING,
        db_column='Id_EstadoPedido'
    )

    usuario = models.ForeignKey(
        'users.Usuario',
        models.DO_NOTHING,
        db_column='Id_Usuario'
    )

    fecha_cambio = models.DateTimeField(
        db_column='Fecha_Cambio',
        blank=True,
        null=True,
        default=timezone.now
    )

    nota = models.TextField(
        db_column='Nota',
        blank=True,
        null=True
    )

    class Meta:
        managed = False
        db_table = 'historial_estado_pedido'