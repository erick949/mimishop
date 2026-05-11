from django.db import models


class CategoriaProducto(models.Model):
    id_categoria = models.CharField(db_column='Id_Categoria', primary_key=True, max_length=36)
    nombre = models.CharField(db_column='Nombre', max_length=255, blank=True, null=True)
    descripcion = models.TextField(db_column='Descripcion', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'categoria_producto'

    def __str__(self):
        return self.nombre or self.id_categoria


class Producto(models.Model):
    id_producto = models.CharField(db_column='Id_Producto', primary_key=True, max_length=36)

    proveedor = models.ForeignKey(
        'providers.Proveedor',
        models.DO_NOTHING,
        db_column='Id_Proveedor',
        related_name='productos'
    )

    categoria = models.ForeignKey(
        CategoriaProducto,
        models.DO_NOTHING,
        db_column='Id_Categoria',
        related_name='productos'
    )

    nombre = models.CharField(db_column='Nombre', max_length=255, blank=True, null=True)
    descripcion = models.TextField(db_column='Descripcion', blank=True, null=True)
    precio = models.DecimalField(db_column='Precio', max_digits=10, decimal_places=2, blank=True, null=True)
    activo = models.BooleanField(db_column='Activo', blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'producto'

    def __str__(self):
        return self.nombre or self.id_producto