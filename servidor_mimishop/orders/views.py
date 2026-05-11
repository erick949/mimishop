# orders/views.py
from django.http import FileResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import DetallePedido
from .pdf_generator import generar_reporte_pdf
from clients.models import Cliente, DireccionCliente, Telefono, Correo


from rest_framework import viewsets
from .models import Pedido, DetallePedido, EstadoPedido, HistorialEstadoPedido
from .serializers import (
    PedidoSerializer,
    DetallePedidoSerializer,
    EstadoPedidoSerializer,
    HistorialSerializer
)


class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        cliente_id = self.request.query_params.get('cliente_id')

        if cliente_id:
            queryset = queryset.filter(cliente_id=cliente_id)

        return queryset
    
class DetallePedidoViewSet(viewsets.ModelViewSet):
    queryset = DetallePedido.objects.all()
    serializer_class = DetallePedidoSerializer


class EstadoPedidoViewSet(viewsets.ModelViewSet):
    queryset = EstadoPedido.objects.all()
    serializer_class = EstadoPedidoSerializer


class HistorialPedidoViewSet(viewsets.ModelViewSet):
    queryset = HistorialEstadoPedido.objects.all()
    serializer_class = HistorialSerializer






@api_view(['POST'])
def generar_reporte(request):
    cliente_id = request.data.get('cliente')
    all_flag   = request.data.get('all', False)
    ids        = request.data.get('productos', [])  # lista de id_detalle

    if not cliente_id:
        return Response({'error': 'cliente requerido'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        cliente = Cliente.objects.get(pk=cliente_id)
    except Cliente.DoesNotExist:
        return Response({'error': 'Cliente no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    if all_flag:
        detalles = DetallePedido.objects.filter(
            pedido__cliente_id=cliente_id
        ).select_related('producto', 'pedido')
    else:
        detalles = DetallePedido.objects.filter(
            id_detalle__in=ids
        ).select_related('producto', 'pedido')

    if not detalles.exists():
        return Response({'error': 'Sin productos'}, status=status.HTTP_400_BAD_REQUEST)

    # Datos de contacto opcionales (toma el primero activo)
    direccion_obj = DireccionCliente.objects.filter(cliente=cliente, activo=True).first()
    telefono_obj  = Telefono.objects.filter(cliente=cliente, activo=True).first()
    correo_obj    = Correo.objects.filter(cliente=cliente, activo=True).first()

    direccion = None
    if direccion_obj:
        direccion = {
            'calle':  direccion_obj.calle,
            'ciudad': direccion_obj.ciudad,
            'estado': direccion_obj.estado,
            'cp':     direccion_obj.cp,
        }

    buffer = generar_reporte_pdf(
        cliente   = cliente,
        detalles  = detalles,
        direccion = direccion,
        correo    = correo_obj.correo    if correo_obj    else None,
        telefono  = telefono_obj.telefono if telefono_obj else None,
    )

    nombre_archivo = f"reporte_{cliente.nombre.replace(' ', '_')}.pdf"
    return FileResponse(buffer, as_attachment=True, filename=nombre_archivo, content_type='application/pdf')