import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/* Formato de fecha dd/mm/yyyy */
function formatearFecha(fecha) {
  if (!fecha) return '—';
  const s = String(fecha).substring(0, 10);
  const [y, m, d] = s.split('-');
  return `${d}/${m}/${y}`;
}

/* Fecha larga para el encabezado del PDF */
function fechaHoy() {
  const hoy = new Date();
  return hoy.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Genera un PDF del reporte con el diseño de MotivaKids.
 *
 * @param {Object} opciones
 * @param {string} opciones.tipo       'paciente' | 'terapeuta'
 * @param {string} opciones.nombre     Nombre del paciente o terapeuta
 * @param {Array}  opciones.registros  Array de registros
 * @param {Object} opciones.totales    { totalMonto, pagados, pendientes }
 */
export function generarReportePDF({ tipo, nombre, registros, totales }) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  /* ============ ENCABEZADO ============ */
  // Banda rosa superior
  doc.setFillColor(233, 30, 99); // #e91e63
  doc.rect(0, 0, pageWidth, 25, 'F');

  // Título
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('MotivaKids', 15, 12);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Terapias integrales para el desarrollo infantil', 15, 18);

  // Fecha de generación a la derecha
  doc.setFontSize(10);
  doc.text(`Generado el ${fechaHoy()}`, pageWidth - 15, 12, { align: 'right' });

  // Título del reporte
  doc.setTextColor(90, 45, 130); // #5a2d82
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Reporte de Pagos', 15, 38);

  // Subtítulo con nombre
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(
    `${tipo === 'paciente' ? 'Paciente' : 'Terapeuta'}: ${nombre || '—'}`,
    15,
    45
  );

  /* ============ TARJETAS DE RESUMEN ============ */
  const cardY = 52;
  const cardWidth = (pageWidth - 30 - 10) / 3;
  const cardHeight = 20;

  const resumen = [
    { label: 'Total de pagos', valor: `S/ ${totales.totalMonto.toFixed(2)}`, color: [168, 85, 247] },
    { label: 'Pagos realizados', valor: String(totales.pagados), color: [34, 197, 94] },
    { label: 'Pagos pendientes', valor: String(totales.pendientes), color: [233, 30, 99] },
  ];

  resumen.forEach((item, i) => {
    const x = 15 + i * (cardWidth + 5);

    // Fondo de la tarjeta
    doc.setFillColor(250, 245, 255); // #faf5ff
    doc.roundedRect(x, cardY, cardWidth, cardHeight, 3, 3, 'F');

    // Barra de color a la izquierda
    doc.setFillColor(...item.color);
    doc.roundedRect(x, cardY, 2, cardHeight, 1, 1, 'F');

    // Label
    doc.setTextColor(120, 120, 120);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(item.label, x + 6, cardY + 7);

    // Valor
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(item.valor, x + 6, cardY + 16);
  });

  /* ============ TABLA ============ */
  const startY = cardY + cardHeight + 8;

  // Cabeceras según el tipo
  let head, body;

  if (tipo === 'paciente') {
    head = [['Fecha cita', 'Terapeuta', 'Especialidad', 'Monto', 'Estado']];
    body = registros.map((r) => [
      formatearFecha(r.fecha_cita),
      r.terapeuta || '—',
      r.especialidad || '—',
      `S/ ${Number(r.monto || 0).toFixed(2)}`,
      r.estado_pago || '—',
    ]);
  } else {
    head = [['Fecha cita', 'Paciente', 'Monto', 'Estado']];
    body = registros.map((r) => [
      formatearFecha(r.fecha_cita),
      r.paciente || '—',
      `S/ ${Number(r.monto || 0).toFixed(2)}`,
      r.estado_pago || '—',
    ]);
  }

  autoTable(doc, {
    head,
    body,
    startY,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 9,
      cellPadding: 3,
      lineColor: [233, 213, 255],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [168, 85, 247], // #a855f7
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
    },
    alternateRowStyles: {
      fillColor: [250, 245, 255], // #faf5ff
    },
    bodyStyles: {
      textColor: [60, 60, 60],
    },
    columnStyles:
      tipo === 'paciente'
        ? {
            0: { cellWidth: 35 },
            1: { cellWidth: 55 },
            2: { cellWidth: 50 },
            3: { cellWidth: 30, halign: 'right' },
            4: { cellWidth: 40, halign: 'center' },
          }
        : {
            0: { cellWidth: 35 },
            1: { cellWidth: 80 },
            2: { cellWidth: 30, halign: 'right' },
            3: { cellWidth: 40, halign: 'center' },
          },
    didDrawPage: (data) => {
      /* ============ PIE DE PÁGINA ============ */
      const pageCount = doc.internal.getNumberOfPages();
      const currentPage = doc.internal.getCurrentPageInfo().pageNumber;

      // Banda inferior rosa
      doc.setFillColor(233, 30, 99);
      doc.rect(0, pageHeight - 10, pageWidth, 10, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(
        'MotivaKids — Pequeños avances, grandes logros',
        15,
        pageHeight - 4
      );
      doc.text(
        `Página ${currentPage} de ${pageCount}`,
        pageWidth - 15,
        pageHeight - 4,
        { align: 'right' }
      );
    },
  });

  /* ============ GUARDAR ============ */
  const nombreArchivo = `Reporte_${tipo === 'paciente' ? 'Paciente' : 'Terapeuta'}_${(nombre || 'sin_nombre')
    .replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`;
  doc.save(nombreArchivo);
}