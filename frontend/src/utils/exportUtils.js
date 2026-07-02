import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export function downloadCsv(filename, rows, headers) {
  const csvRows = [headers.join(',')];
  rows.forEach((row) => {
    const escaped = row.map((value) => `"${String(value).replace(/"/g, '""')}"`);
    csvRows.push(escaped.join(','));
  });

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadExcel(filename, rows, headers) {
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, filename);
}

export function downloadPdf(filename, title, rows, headers) {
  const doc = new jsPDF();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(title, 14, 16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Generated ${new Date().toLocaleString()}`, 14, 24);
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 32,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [21, 101, 192] },
  });
  doc.setFontSize(9);
  doc.text('LivestockGuard AI', 14, doc.internal.pageSize.height - 12);
  doc.text(`Page ${doc.getCurrentPageInfo().pageNumber}`, 180, doc.internal.pageSize.height - 12);
  doc.save(filename);
}
