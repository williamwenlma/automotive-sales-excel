import fs from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const sourcePath = process.argv[2] ? resolve(process.argv[2]) : fileURLToPath(new URL('./Mingfang_Zhong_20260826_030056_ms4p3jyr.0qy.xlsx', import.meta.url));
const outputDir = process.argv[3] ? resolve(process.argv[3]) : fileURLToPath(new URL('./outputs/vietnam_simulation/', import.meta.url));
const outputPath = `${outputDir}/越南乘用车注册模拟数据_2026.xlsx`;

const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(sourcePath));
const ws = wb.worksheets.getItem('Data Export');
const used = ws.getUsedRange();
const values = used.values;
const rows = values.length;

const multipliers = {
  TOYOTA: 1.18, HYUNDAI: 1.12, KIA: 1.05, FORD: 1.28, MITSUBISHI: 1.22,
  MAZDA: 0.94, HONDA: 1.02, SUZUKI: 0.72, NISSAN: 0.82, ISUZU: 0.78,
  PEUGEOT: 0.48, VOLKSWAGEN: 0.42, MG: 0.76, BYD: 0.58, AION: 0.36,
  BMW: 0.48, MERCEDES: 0.50, 'MERCEDES-BENZ': 0.50, AUDI: 0.42,
  PORSCHE: 0.45, VOLVO: 0.50, LEXUS: 0.55, SUBARU: 0.58,
};
const luxury = new Set(['ASTON MARTIN','BENTLEY','FERRARI','LAMBORGHINI','LOTUS','MASERATI','MCLAREN','ROLLS-ROYCE']);
const season = [1.12, 0.78, 0.84, 0.96, 1.02, 1.08, 1.13, 1.07];
function hashNoise(row, month, brand) {
  let h = 2166136261;
  const s = `${row}|${month}|${brand}`;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return 0.84 + ((h >>> 0) % 3300) / 10000;
}

for (let r = 1; r < rows; r++) {
  values[r][1] = '越南';
  const brand = String(values[r][2] ?? '').toUpperCase();
  const brandFactor = luxury.has(brand) ? 0.26 : (multipliers[brand] ?? 0.68);
  for (let m = 0; m < 8; m++) {
    const base = Number(values[r][6 + m]) || 0;
    let simulated = Math.round(base * brandFactor * season[m] * hashNoise(r, m, brand));
    if (base === 0 && ((r * 17 + m * 11) % 97 === 0)) simulated = 1;
    values[r][6 + m] = Math.max(0, simulated);
  }
}

const vinfastRows = [
  ['乘用车 注册数据','越南','VINFAST','VF 3','BEV PLUS AUTO','运动型多功能车',4220,2780,3150,3870,4360,4980,5210,4870],
  ['乘用车 注册数据','越南','VINFAST','VF 5','BEV PLUS AUTO','运动型多功能车',3680,2410,2760,3340,3820,4250,4570,4390],
  ['乘用车 注册数据','越南','VINFAST','VF 6','BEV ECO AUTO','运动型多功能车',2210,1480,1690,2050,2380,2640,2890,2710],
  ['乘用车 注册数据','越南','VINFAST','VF 7','BEV BASE AUTO','运动型多功能车',1840,1190,1370,1660,1920,2180,2360,2240],
  ['乘用车 注册数据','越南','VINFAST','VF 8','BEV ECO AUTO AWD','运动型多功能车',1320,860,990,1210,1380,1540,1670,1590],
  ['乘用车 注册数据','越南','VINFAST','VF 9','BEV ECO AUTO AWD','运动型多功能车',410,270,310,380,430,480,520,500],
  ['乘用车 注册数据','越南','VINFAST','HERIO GREEN','BEV AUTO','运动型多功能车',980,640,730,910,1060,1240,1390,1450],
  ['乘用车 注册数据','越南','VINFAST','LIMO GREEN','BEV AUTO','多用途乘用车',620,410,470,590,720,860,980,1050],
];
for (let i = 0; i < vinfastRows.length; i++) values[1 + i] = vinfastRows[i];

ws.getRange(`A1:N${rows}`).values = values;
ws.getRange(`G2:N${rows}`).format.numberFormat = '#,##0';
wb.recalculate();
await fs.mkdir(outputDir, {recursive:true});
const out = await SpreadsheetFile.exportXlsx(wb);
await out.save(outputPath);

const key = await wb.inspect({kind:'table', range:'Data Export!A1:N12', include:'values,formulas', tableMaxRows:12, tableMaxCols:14, maxChars:8000});
console.log(key.ndjson);
const errors = await wb.inspect({kind:'match', searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!', options:{useRegex:true,maxResults:300}, summary:'final formula error scan', maxChars:3000});
console.log('ERRORS\n'+errors.ndjson);
const preview = await wb.render({sheetName:'Data Export', range:'A1:N30', scale:1.5, format:'png'});
await fs.writeFile(`${outputDir}/preview.png`, new Uint8Array(await preview.arrayBuffer()));
console.log(`OUTPUT=${outputPath}`);
