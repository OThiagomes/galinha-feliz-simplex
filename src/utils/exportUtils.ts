
import { FormulationResult } from '@/types/nutrition';

export const exportToCSV = (result: FormulationResult): void => {
  if (!result.feasible) return;

  const csvContent = [
    ['Ingrediente', 'Porcentagem (%)', 'Custo (R$/kg)', 'Proteína (%)', 'Energia (kcal/kg)', 'Cálcio (%)', 'Fósforo (%)'],
    ...result.ingredients.map(item => [
      item.ingredient.name,
      item.percentage.toFixed(2),
      item.cost.toFixed(4),
      item.ingredient.protein.toString(),
      item.ingredient.energy.toString(),
      item.ingredient.calcium.toString(),
      item.ingredient.phosphorus.toString()
    ]),
    [],
    ['PERFIL NUTRICIONAL DA RAÇÃO'],
    ['Proteína Bruta (%)', result.nutritionalProfile.protein.toFixed(2)],
    ['Energia Metabolizável (kcal/kg)', result.nutritionalProfile.energy.toFixed(0)],
    ['Cálcio (%)', result.nutritionalProfile.calcium.toFixed(2)],
    ['Fósforo (%)', result.nutritionalProfile.phosphorus.toFixed(2)],
    ['Lisina (%)', result.nutritionalProfile.lysine.toFixed(2)],
    ['Metionina (%)', result.nutritionalProfile.methionine.toFixed(2)],
    ['Fibra Bruta (%)', result.nutritionalProfile.fiber.toFixed(2)],
    [],
    ['CUSTO TOTAL', `R$ ${result.totalCost.toFixed(4)}/kg`]
  ];

  const csvString = csvContent.map(row => row.join(',')).join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `formulacao_racao_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportToPDF = (result: FormulationResult): void => {
  if (!result.feasible) return;

  const printContent = `
    <html>
      <head>
        <title>Formulação de Ração - Poedeiras</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
          h2 { color: #059669; margin-top: 30px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background-color: #f3f4f6; font-weight: bold; }
          .cost-highlight { font-size: 24px; font-weight: bold; color: #059669; }
          .summary { background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <h1>Formulação de Ração para Poedeiras Comerciais</h1>
        <div class="summary">
          <h2>Resumo da Formulação</h2>
          <p><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
          <p><strong>Custo Total:</strong> <span class="cost-highlight">R$ ${result.totalCost.toFixed(4)}/kg</span></p>
          <p><strong>Status:</strong> ${result.feasible ? 'Formulação Viável' : 'Formulação Inviável'}</p>
        </div>

        <h2>Composição da Ração</h2>
        <table>
          <thead>
            <tr>
              <th>Ingrediente</th>
              <th>Porcentagem (%)</th>
              <th>Custo (R$/kg)</th>
              <th>Proteína (%)</th>
              <th>Energia (kcal/kg)</th>
              <th>Cálcio (%)</th>
              <th>Fósforo (%)</th>
            </tr>
          </thead>
          <tbody>
            ${result.ingredients.map(item => `
              <tr>
                <td>${item.ingredient.name}</td>
                <td>${item.percentage.toFixed(2)}</td>
                <td>${item.cost.toFixed(4)}</td>
                <td>${item.ingredient.protein}</td>
                <td>${item.ingredient.energy}</td>
                <td>${item.ingredient.calcium}</td>
                <td>${item.ingredient.phosphorus}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h2>Perfil Nutricional da Ração</h2>
        <table>
          <tr><td><strong>Proteína Bruta (%)</strong></td><td>${result.nutritionalProfile.protein.toFixed(2)}</td></tr>
          <tr><td><strong>Energia Metabolizável (kcal/kg)</strong></td><td>${result.nutritionalProfile.energy.toFixed(0)}</td></tr>
          <tr><td><strong>Cálcio (%)</strong></td><td>${result.nutritionalProfile.calcium.toFixed(2)}</td></tr>
          <tr><td><strong>Fósforo (%)</strong></td><td>${result.nutritionalProfile.phosphorus.toFixed(2)}</td></tr>
          <tr><td><strong>Lisina (%)</strong></td><td>${result.nutritionalProfile.lysine.toFixed(2)}</td></tr>
          <tr><td><strong>Metionina (%)</strong></td><td>${result.nutritionalProfile.methionine.toFixed(2)}</td></tr>
          <tr><td><strong>Fibra Bruta (%)</strong></td><td>${result.nutritionalProfile.fiber.toFixed(2)}</td></tr>
        </table>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }
};
