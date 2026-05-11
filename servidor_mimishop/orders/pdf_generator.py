# orders/pdf_generator.py
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT
from io import BytesIO


def generar_reporte_pdf(cliente, detalles, direccion=None, correo=None, telefono=None):
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=2*cm,
        leftMargin=2*cm,
        topMargin=2*cm,
        bottomMargin=2*cm,
    )

    styles = getSampleStyleSheet()
    elements = []

    # ── Colores ──
    DARK    = colors.HexColor('#0f1117')
    ACCENT  = colors.HexColor('#38bdf8')
    LIGHT   = colors.HexColor('#f0f6ff')
    GRAY    = colors.HexColor('#64748b')
    BORDER  = colors.HexColor('#e2e8f0')
    WHITE   = colors.white

    # ── Estilos de texto ──
    title_style = ParagraphStyle('title', fontName='Helvetica-Bold', fontSize=22,
                                  textColor=DARK, spaceAfter=4)
    sub_style   = ParagraphStyle('sub',   fontName='Helvetica',      fontSize=10,
                                  textColor=GRAY, spaceAfter=2)
    label_style = ParagraphStyle('label', fontName='Helvetica-Bold', fontSize=9,
                                  textColor=GRAY, spaceAfter=1)
    value_style = ParagraphStyle('value', fontName='Helvetica',      fontSize=10,
                                  textColor=DARK, spaceAfter=2)
    note_style  = ParagraphStyle('note',  fontName='Helvetica-Oblique', fontSize=10,
                                  textColor=GRAY, alignment=TA_CENTER, spaceBefore=10)

    # ══ ENCABEZADO ══
    elements.append(Paragraph("Reporte de Compra", title_style))
    elements.append(Paragraph("Resumen de productos seleccionados", sub_style))
    elements.append(Spacer(1, 0.4*cm))

    # ── Línea divisoria ──
    elements.append(Table(
        [['']],
        colWidths=[17*cm],
        style=TableStyle([('LINEBELOW', (0,0), (-1,-1), 1.5, ACCENT)])
    ))
    elements.append(Spacer(1, 0.5*cm))

    # ══ DATOS DEL CLIENTE ══
    cliente_data = [
        [Paragraph("Cliente", label_style),    Paragraph(cliente.nombre or '—', value_style)],
    ]
    if correo:
        cliente_data.append([Paragraph("Correo", label_style), Paragraph(correo, value_style)])
    if telefono:
        cliente_data.append([Paragraph("Teléfono", label_style), Paragraph(telefono, value_style)])
    if direccion:
        dir_str = ', '.join(filter(None, [
            direccion.get('calle'), direccion.get('ciudad'),
            direccion.get('estado'), direccion.get('cp')
        ]))
        cliente_data.append([Paragraph("Dirección", label_style), Paragraph(dir_str, value_style)])

    cliente_table = Table(cliente_data, colWidths=[3.5*cm, 13.5*cm])
    cliente_table.setStyle(TableStyle([
        ('VALIGN',      (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING',(0,0),(-1,-1), 4),
        ('TOPPADDING',  (0,0), (-1,-1), 2),
    ]))
    elements.append(cliente_table)
    elements.append(Spacer(1, 0.6*cm))

    # ══ TABLA DE PRODUCTOS ══
    header = [
        Paragraph('Producto',   ParagraphStyle('h', fontName='Helvetica-Bold', fontSize=9, textColor=WHITE)),
        Paragraph('Cantidad',   ParagraphStyle('h', fontName='Helvetica-Bold', fontSize=9, textColor=WHITE, alignment=TA_CENTER)),
        Paragraph('Precio U.',  ParagraphStyle('h', fontName='Helvetica-Bold', fontSize=9, textColor=WHITE, alignment=TA_RIGHT)),
        Paragraph('Subtotal',   ParagraphStyle('h', fontName='Helvetica-Bold', fontSize=9, textColor=WHITE, alignment=TA_RIGHT)),
    ]

    rows = [header]
    total_general = 0

    for d in detalles:
        nombre    = d.producto.nombre if hasattr(d, 'producto') else str(d.get('producto_nombre', '—'))
        cantidad  = d.cantidad if hasattr(d, 'cantidad') else d.get('cantidad', 1)
        precio    = float(d.precio_unitario if hasattr(d, 'precio_unitario') else d.get('precio_unitario', 0))
        subtotal  = float(d.subtotal if hasattr(d, 'subtotal') else d.get('subtotal', precio * cantidad))
        total_general += subtotal

        p_name = ParagraphStyle('pn', fontName='Helvetica', fontSize=9, textColor=DARK)
        p_num  = ParagraphStyle('pn', fontName='Helvetica', fontSize=9, textColor=DARK, alignment=TA_CENTER)
        p_r    = ParagraphStyle('pn', fontName='Helvetica', fontSize=9, textColor=DARK, alignment=TA_RIGHT)

        rows.append([
            Paragraph(nombre,                              p_name),
            Paragraph(str(cantidad),                       p_num),
            Paragraph(f'${precio:,.2f}',                   p_r),
            Paragraph(f'${subtotal:,.2f}',                 p_r),
        ])

    # Fila de total
    p_total_label = ParagraphStyle('tl', fontName='Helvetica-Bold', fontSize=10,
                                    textColor=DARK, alignment=TA_RIGHT)
    p_total_val   = ParagraphStyle('tv', fontName='Helvetica-Bold', fontSize=10,
                                    textColor=ACCENT, alignment=TA_RIGHT)
    rows.append(['', '', Paragraph('Total', p_total_label), Paragraph(f'${total_general:,.2f}', p_total_val)])

    prod_table = Table(rows, colWidths=[8.5*cm, 2.5*cm, 3*cm, 3*cm])
    prod_table.setStyle(TableStyle([
        # Header
        ('BACKGROUND',    (0,0),  (-1,0),  DARK),
        ('ROWBACKGROUNDS',(0,1),  (-1,-2), [WHITE, colors.HexColor('#f8fafc')]),
        # Bordes
        ('GRID',          (0,0),  (-1,-2), 0.4, BORDER),
        ('LINEABOVE',     (0,0),  (-1,0),  1.5, DARK),
        ('LINEBELOW',     (0,0),  (-1,0),  1,   ACCENT),
        # Fila total
        ('LINEABOVE',     (0,-1), (-1,-1), 1,   ACCENT),
        ('TOPPADDING',    (0,-1), (-1,-1), 8),
        # Padding general
        ('TOPPADDING',    (0,0),  (-1,-1), 7),
        ('BOTTOMPADDING', (0,0),  (-1,-1), 7),
        ('LEFTPADDING',   (0,0),  (-1,-1), 8),
        ('RIGHTPADDING',  (0,0),  (-1,-1), 8),
        ('VALIGN',        (0,0),  (-1,-1), 'MIDDLE'),
    ]))
    elements.append(prod_table)
    elements.append(Spacer(1, 1*cm))

    # ══ NOTA FINAL ══
    elements.append(Table(
        [['']],
        colWidths=[17*cm],
        style=TableStyle([('LINEABOVE', (0,0), (-1,-1), 0.5, BORDER)])
    ))
    elements.append(Spacer(1, 0.4*cm))
    elements.append(Paragraph("¡Gracias por su compra!", ParagraphStyle(
        'thanks', fontName='Helvetica-Bold', fontSize=13, textColor=DARK, alignment=TA_CENTER, spaceBefore=4
    )))
    elements.append(Paragraph(
        "Agradecemos su preferencia. Si tiene alguna duda sobre su pedido, no dude en contactarnos.",
        note_style
    ))

    doc.build(elements)
    buffer.seek(0)
    return buffer