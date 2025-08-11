/*
  Generates a helper SQL file from the backup for question-related tables only.
  Usage (from backend/):
    node scripts/generate-questions-sql.js

  Output: src/migrations/1723320000000-import-questions-from-backup.sql
*/
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const backupPath = process.env.QUESTIONS_BACKUP_PATH || path.resolve(repoRoot, 'bck_coop_11-8-2025.sql');
const outPath = path.resolve(__dirname, '..', 'src', 'migrations', '1723320000000-import-questions-from-backup.sql');

if (!fs.existsSync(backupPath)) {
  console.error('Backup not found:', backupPath);
  process.exit(1);
}

const raw = fs.readFileSync(backupPath, 'utf8');

function parseCopy(label) {
  const startRe = new RegExp(`COPY\\s+${label}\\s*\\([^)]*\\)\\s*FROM\\s+stdin;\\r?\\n`, 'i');
  const startMatch = startRe.exec(raw);
  if (!startMatch) return [];
  const contentStart = startMatch.index + startMatch[0].length;
  const terminatorUnix = '\n\\.\n';
  const terminatorWin = '\r\n\\.\r\n';
  let endIdx = raw.indexOf(terminatorUnix, contentStart);
  if (endIdx === -1) endIdx = raw.indexOf(terminatorWin, contentStart);
  if (endIdx === -1) return [];
  const block = raw.slice(contentStart, endIdx);
  return block.split(/\r?\n/).filter((l) => l && l !== '\\.' && !l.startsWith('--'));
}

function esc(v) {
  if (v === null || v === undefined) return 'NULL';
  return "'" + String(v).replace(/\\/g, "\\\\").replace(/'/g, "''") + "'";
}

const questionLines = parseCopy('public.question');
const singleLines = parseCopy('public.question_single');
const optionLines = parseCopy('public.question_single_option');
const resultLines = parseCopy('public.question_single_result');
const resultOptionLines = parseCopy('public.question_single_result_option');

let sql = '';
sql += '-- Auto-generated SQL for question-related tables\n';
sql += 'DELETE FROM public."question_single_result_option";\n';
sql += 'DELETE FROM public."question_single_result";\n';
sql += 'DELETE FROM public."question_single_option";\n';
sql += 'DELETE FROM public."question_single";\n';
sql += 'DELETE FROM public."question";\n';

for (const line of questionLines) {
  const [id, questionnaire, name, description] = line.split('\t');
  sql += `INSERT INTO public."question" (id, questionnaire, name, description) VALUES (${esc(id)}, ${esc(questionnaire)}, ${esc(name)}, ${esc(description)});\n`;
}

for (const line of singleLines) {
  const [id, value, valueType, key, label, required, order, hint, controlType, type, _deletedAt, questionId] = line.split('\t');
  const requiredBool = required === 't' || required === 'true' ? 'true' : 'false';
  const orderNum = parseInt(order || '0', 10);
  sql += `INSERT INTO public."question_single" (id, value, "valueType", key, label, required, "order", hint, "controlType", type, "questionId") VALUES (${esc(id)}, ${value === '\\N' ? 'NULL' : esc(value)}, ${esc(valueType)}, ${key ? esc(key) : 'NULL'}, ${label === '\\N' ? 'NULL' : esc(label)}, ${requiredBool}, ${orderNum}, ${hint === '\\N' ? 'NULL' : esc(hint)}, ${esc(controlType)}, ${type === '\\N' ? 'NULL' : esc(type)}, ${esc(questionId)});\n`;
}

for (const line of optionLines) {
  const [id, value, valueType, key, _deletedAt, singleQuestionId] = line.split('\t');
  sql += `INSERT INTO public."question_single_option" (id, value, "valueType", key, "singleQuestionId") VALUES (${esc(id)}, ${value === '\\N' ? 'NULL' : esc(value)}, ${esc(valueType)}, ${esc(key)}, ${esc(singleQuestionId)});\n`;
}

for (const line of resultLines) {
  const [id, value, valueType, key, label, required, order, hint, controlType, type, _deletedAt, questionId] = line.split('\t');
  const requiredBool = required === 't' || required === 'true' ? 'true' : 'false';
  const orderNum = parseInt(order || '0', 10);
  sql += `INSERT INTO public."question_single_result" (id, value, "valueType", key, label, required, "order", hint, "controlType", type, "questionId") VALUES (${esc(id)}, ${value === '\\N' ? 'NULL' : esc(value)}, ${esc(valueType)}, ${key ? esc(key) : 'NULL'}, ${label === '\\N' ? 'NULL' : esc(label)}, ${requiredBool}, ${orderNum}, ${hint === '\\N' ? 'NULL' : esc(hint)}, ${esc(controlType)}, ${type === '\\N' ? 'NULL' : esc(type)}, ${esc(questionId)});\n`;
}

for (const line of resultOptionLines) {
  const [id, value, valueType, key, _deletedAt, singleQuestionId] = line.split('\t');
  sql += `INSERT INTO public."question_single_result_option" (id, value, "valueType", key, "singleQuestionId") VALUES (${esc(id)}, ${value === '\\N' ? 'NULL' : esc(value)}, ${esc(valueType)}, ${esc(key)}, ${esc(singleQuestionId)});\n`;
}

fs.writeFileSync(outPath, sql, 'utf8');
console.log('Generated SQL at', outPath);


