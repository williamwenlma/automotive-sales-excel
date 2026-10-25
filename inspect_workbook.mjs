import fs from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const inputPath = process.argv[2] ? resolve(process.argv[2]) : fileURLToPath(new URL('./Mingfang_Zhong_20260826_030056_ms4p3jyr.0qy.xlsx', import.meta.url));
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));
const overview = await wb.inspect({kind:'workbook,sheet,table,drawing,definedName', maxChars:15000, tableMaxRows:12, tableMaxCols:15, tableMaxCellChars:100});
console.log(overview.ndjson);
const sheets = await wb.inspect({kind:'sheet', include:'id,name', maxChars:4000});
console.log('SHEETS\n'+sheets.ndjson);
for (const line of sheets.ndjson.split(/\r?\n/)) {
  try {
    const rec=JSON.parse(line); const name=rec.name;
    if (!name) continue;
    const region=await wb.inspect({kind:'region', sheetId:name, range:'A1:AZ120', maxChars:12000, tableMaxRows:120, tableMaxCols:52, tableMaxCellChars:120});
    console.log(`REGION ${name}\n${region.ndjson}`);
  } catch {}
}
const styles=await wb.inspect({kind:'computedStyle', sheetId:'Data Export', range:'A1:N12', maxChars:5000});
console.log('STYLES\n'+styles.ndjson);
const preview=await wb.render({sheetName:'Data Export', range:'A1:N30', scale:1.5, format:'png'});
await fs.writeFile(fileURLToPath(new URL('./source_preview.png', import.meta.url)), new Uint8Array(await preview.arrayBuffer()));
