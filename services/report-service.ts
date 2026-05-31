import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import type { SecurityScan } from "@/types/scan";

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN = 46;

function wrapLine(text: string, maxChars = 92) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (test.length <= maxChars) {
      current = test;
      continue;
    }

    if (current) lines.push(current);
    current = word;
  }

  if (current) lines.push(current);
  return lines;
}

export async function createSecurityReportPdf(scan: SecurityScan) {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let cursorY = PAGE_HEIGHT - MARGIN;

  const drawHeading = (text: string, size = 18) => {
    page.drawText(text, {
      x: MARGIN,
      y: cursorY,
      size,
      font: bold,
      color: rgb(0.08, 0.16, 0.27)
    });
    cursorY -= size + 8;
  };

  const drawBody = (text: string, size = 10, color = rgb(0.2, 0.2, 0.24)) => {
    const lines = wrapLine(text);
    for (const line of lines) {
      if (cursorY < MARGIN + 30) {
        page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        cursorY = PAGE_HEIGHT - MARGIN;
      }

      page.drawText(line, {
        x: MARGIN,
        y: cursorY,
        size,
        font: regular,
        color
      });
      cursorY -= size + 4;
    }
  };

  drawHeading("SecureAI Inspector", 24);
  drawBody("Passive Website Security Report", 12, rgb(0.28, 0.32, 0.38));
  cursorY -= 8;

  drawBody(`Scanned URL: ${scan.url}`);
  drawBody(`Timestamp: ${new Date(scan.scannedAt).toLocaleString()}`);
  drawBody(`Security Score: ${scan.score}/100 (${scan.grade})`);
  cursorY -= 10;

  drawHeading("Findings", 16);
  for (const finding of scan.findings) {
    drawBody(`${finding.passed ? "PASS" : "FAIL"} | ${finding.name} | ${finding.value}`);
  }

  if (scan.aiExplanations.length > 0) {
    cursorY -= 10;
    drawHeading("AI Explanations", 16);

    for (const explanation of scan.aiExplanations) {
      drawBody(`Issue: ${explanation.finding}`, 11, rgb(0.11, 0.19, 0.32));
      drawBody(`What it means: ${explanation.whatItMeans}`);
      drawBody(`Why it matters: ${explanation.whyItMatters}`);
      drawBody(`Risk level: ${explanation.riskLevel}`);
      drawBody(`How to fix: ${explanation.howToFix}`);
      cursorY -= 6;
    }
  }

  return pdf.save();
}
