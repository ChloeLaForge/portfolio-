import ExcelJS from 'exceljs';
import { ASSISTANT_PAGES } from '../../shared/assistant.js';
import { buildSummary, groupCommonQuestions } from './summary.js';
import { PAGE_LABELS, TOPICS, type ChatRecord } from './types.js';

/**
 * Builds portfolio-chat-analytics.xlsx from stored records. Every visitor
 * string is written as plain text, so a question that starts with "=" shows
 * up as text and can never run as a spreadsheet formula.
 */

export const CHAT_LOG_HEADERS = [
  'Timestamp',
  'Session ID',
  'Page',
  'Visitor Question',
  'AI Response',
  'Topic',
  'Fallback Used',
  'Status',
  'Error Type',
  'Model',
] as const;

const FONT = 'Arial';
const DATE_FORMAT = 'yyyy-mm-dd hh:mm:ss';

function styleHeader(row: ExcelJS.Row): void {
  row.eachCell((cell) => {
    cell.font = { name: FONT, size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF191B1E' } };
    cell.alignment = { vertical: 'middle', wrapText: true };
  });
  row.height = 22;
}

function styleBody(sheet: ExcelJS.Worksheet, fromRow: number): void {
  for (let i = fromRow; i <= sheet.rowCount; i++) {
    sheet.getRow(i).eachCell({ includeEmpty: true }, (cell) => {
      cell.font = { name: FONT, size: 10 };
      cell.alignment = { vertical: 'top', wrapText: true };
    });
  }
}

function widths(sheet: ExcelJS.Worksheet, list: number[]): void {
  list.forEach((width, i) => (sheet.getColumn(i + 1).width = width));
}

export async function buildWorkbook(records: ChatRecord[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Portfolio assistant analytics';
  workbook.created = new Date();

  /* ---------- CHAT LOG ---------- */
  const log = workbook.addWorksheet('CHAT LOG', { views: [{ state: 'frozen', ySplit: 1 }] });
  styleHeader(log.addRow([...CHAT_LOG_HEADERS]));
  for (const r of records) {
    log.addRow([
      r.createdAt,
      r.sessionId,
      PAGE_LABELS[r.page] ?? r.page,
      r.question,
      r.response ?? '',
      r.topic,
      r.fallbackUsed ? 'Yes' : 'No',
      r.status,
      r.errorType ?? '',
      r.model,
    ]);
  }
  styleBody(log, 2);
  log.getColumn(1).numFmt = DATE_FORMAT;
  widths(log, [20, 38, 16, 50, 80, 18, 13, 10, 26, 16]);
  log.autoFilter = { from: { row: 1, column: 1 }, to: { row: Math.max(1, log.rowCount), column: CHAT_LOG_HEADERS.length } };

  /* ---------- SUMMARY ---------- */
  const s = buildSummary(records);
  const summary = workbook.addWorksheet('SUMMARY');
  widths(summary, [40, 16, 20]);

  const headerRows: number[] = [];
  const header = (...cells: string[]) => headerRows.push(summary.addRow(cells).number);
  const heading = (title: string, ...columns: string[]) => {
    summary.addRow([]);
    header(title, ...columns);
  };
  const line = (label: string, value: string | number | Date | null, format?: string) => {
    const row = summary.addRow([label, value ?? '']);
    if (format) row.getCell(2).numFmt = format;
    row.getCell(2).alignment = { horizontal: 'right', vertical: 'top' };
  };
  const share = (n: number, total: number) => (total ? n / total : 0);

  header('Overview', 'Value');
  line('Total questions', s.totalQuestions);
  line('Total sessions', s.totalSessions);
  line('Successful responses', s.successful);
  line('Errors (failed or rate-limited requests)', s.errors);
  line('Error rate (errors / total questions)', s.errorRate, '0.0%');
  line('Fallback responses (assistant could not answer)', s.fallbacks);
  line('Fallback % (fallbacks / successful responses)', s.fallbackRate, '0.0%');
  line('First question (UTC)', s.firstAt, DATE_FORMAT);
  line('Latest question (UTC)', s.lastAt, DATE_FORMAT);

  heading('Questions by Topic', 'Questions', 'Share of Questions');
  for (const topic of TOPICS) {
    const row = summary.addRow([topic, s.byTopic[topic], share(s.byTopic[topic], s.totalQuestions)]);
    row.getCell(3).numFmt = '0.0%';
  }

  heading('Questions by Portfolio Page', 'Questions', 'Share of Questions');
  for (const page of ASSISTANT_PAGES) {
    const row = summary.addRow([PAGE_LABELS[page], s.byPage[page], share(s.byPage[page], s.totalQuestions)]);
    row.getCell(3).numFmt = '0.0%';
  }

  heading('Fallback Responses by Topic', 'Fallbacks', 'Share of Topic Questions');
  for (const topic of TOPICS) {
    const row = summary.addRow([topic, s.fallbacksByTopic[topic], share(s.fallbacksByTopic[topic], s.byTopic[topic])]);
    row.getCell(3).numFmt = '0.0%';
  }

  heading('Errors by Type', 'Count');
  const errorTypes = Object.entries(s.errorsByType).sort((a, b) => b[1] - a[1]);
  if (errorTypes.length === 0) summary.addRow(['None', 0]);
  for (const [type, count] of errorTypes) summary.addRow([type, count]);

  summary.addRow([]);
  summary.addRow([`Snapshot generated ${new Date().toISOString()} (UTC). Re-export for fresh numbers; these are not live formulas.`]);
  summary.addRow(['Sessions are anonymous random ids; one browser tab load is one session.']);
  styleBody(summary, 1);
  headerRows.forEach((n) => styleHeader(summary.getRow(n)));

  /* ---------- COMMON QUESTIONS ---------- */
  const common = workbook.addWorksheet('COMMON QUESTIONS', { views: [{ state: 'frozen', ySplit: 1 }] });
  const commonHeaders = ['Question (most recent wording)', 'Times Asked', 'Distinct Sessions', 'Topic', 'Fallback Count', 'First Asked', 'Last Asked', 'Other Wordings'];
  styleHeader(common.addRow(commonHeaders));
  for (const q of groupCommonQuestions(records)) {
    common.addRow([q.question, q.timesAsked, q.sessions, q.topic, q.fallbackCount, q.firstAsked, q.lastAsked, q.otherWordings.join('\n')]);
  }
  styleBody(common, 2);
  common.getColumn(6).numFmt = DATE_FORMAT;
  common.getColumn(7).numFmt = DATE_FORMAT;
  widths(common, [56, 12, 12, 18, 13, 20, 20, 60]);
  common.autoFilter = { from: { row: 1, column: 1 }, to: { row: Math.max(1, common.rowCount), column: commonHeaders.length } };

  return Buffer.from(await workbook.xlsx.writeBuffer());
}
