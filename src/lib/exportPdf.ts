import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { AppState } from '../state/types';
import { compositeScore, pillarScores, isFlagged, fmt } from '../state/scoring';

export function exportPdf(state: AppState) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  const date = new Date().toISOString().slice(0, 10);

  doc.setFontSize(18);
  doc.setTextColor('#0f172a');
  doc.text('SaaS Decision Matrix', 40, 44);
  doc.setFontSize(10);
  doc.setTextColor('#64748b');
  doc.text(`Ranked idea report  ·  ${date}`, 40, 62);

  const ranked = [...state.ideas]
    .map((idea) => ({
      idea,
      composite: compositeScore(idea, state.weights),
      pillars: pillarScores(idea, state.weights),
      flagged: isFlagged(idea, state.weights),
    }))
    .sort((a, b) => b.composite - a.composite);

  autoTable(doc, {
    startY: 80,
    head: [['#', 'Idea', 'Composite', 'Desirability', 'Feasibility', 'Viability', 'Flag']],
    body: ranked.map((r, i) => [
      String(i + 1),
      r.idea.description ? `${r.idea.name}\n${r.idea.description}` : r.idea.name,
      fmt(r.composite),
      fmt(r.pillars.desirability),
      fmt(r.pillars.feasibility),
      fmt(r.pillars.viability),
      r.flagged ? 'WEAK' : '',
    ]),
    styles: { fontSize: 10, cellPadding: 6, valign: 'middle' },
    headStyles: { fillColor: [79, 70, 229], textColor: 255 },
    columnStyles: {
      0: { halign: 'center', cellWidth: 30 },
      2: { halign: 'center' },
      3: { halign: 'center' },
      4: { halign: 'center' },
      5: { halign: 'center' },
      6: { halign: 'center', textColor: [213, 94, 0] },
    },
    didParseCell: (data) => {
      // tint composite/pillar cells by traffic light
      if (data.section === 'body' && data.column.index >= 2 && data.column.index <= 5) {
        const val = parseFloat(data.cell.text[0]);
        if (!isNaN(val)) {
          if (val >= 3.5) data.cell.styles.textColor = [0, 114, 178];
          else if (val >= 2.0) data.cell.styles.textColor = [230, 159, 0];
          else data.cell.styles.textColor = [213, 94, 0];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
  });

  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
  doc.setFontSize(8);
  doc.setTextColor('#94a3b8');
  doc.text(
    'Scoring: Strong >= 3.5  ·  Caution 2.0-3.49  ·  Weak < 2.0. Any pillar < 2.0 flags the idea WEAK.',
    40,
    Math.min(finalY + 24, 560)
  );

  doc.save(`saas-ideas-${date}.pdf`);
}
