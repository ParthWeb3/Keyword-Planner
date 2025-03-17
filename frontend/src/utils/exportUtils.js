import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToCSV = (data, filename = 'keywords.csv') => {
  const csvContent =
    'data:text/csv;charset=utf-8,' +
    ['Keyword,Search Volume,CPC,Competition']
      .concat(
        data.map(
          (row) =>
            `${row.keyword},${row.searchVolume},${row.cpc},${row.competition}`
        )
      )
      .join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (data, filename = 'keywords.pdf') => {
  const doc = new jsPDF();
  const tableData = data.map((row) => [
    row.keyword,
    row.searchVolume,
    row.cpc,
    row.competition,
  ]);
  autoTable(doc, {
    head: [['Keyword', 'Search Volume', 'CPC', 'Competition']],
    body: tableData,
  });
  doc.save(filename);
};
