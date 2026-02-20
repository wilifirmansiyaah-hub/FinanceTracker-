import { Transaction } from "@/types/finance";

export const exportToCSV = (transactions: Transaction[], filename = 'finance-data.csv') => {
  if (!transactions.length) return;

  const headers = ['Date', 'Type', 'Category', 'Description', 'Amount'];
  const csvContent = [
    headers.join(','),
    ...transactions.map(t => 
      [
        `"${new Date(t.date).toISOString().split('T')[0]}"`,
        `"${t.type}"`,
        `"${t.category}"`,
        `"${t.description}"`,
        `${t.amount}`
      ].join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
