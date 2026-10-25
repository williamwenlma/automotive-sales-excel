import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';
const path = process.argv[2] ? resolve(process.argv[2]) : fileURLToPath(new URL('./outputs/vietnam_simulation/越南乘用车注册模拟数据_2026.xlsx', import.meta.url));
const wb=await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const data = wb.worksheets.getItem('Data Export').getUsedRange().values;
assert(data.length > 8, 'Expected data rows and eight VINFAST examples');
for (const [index, row] of data.slice(1).entries()) {
  assert.equal(row[1], '越南', `Unexpected country at row ${index + 2}`);
  assert.equal(row.slice(6, 14).length, 8, `Missing month columns at row ${index + 2}`);
  for (const value of row.slice(6, 14)) {
    assert(Number.isInteger(value) && value >= 0, `Invalid simulated volume at row ${index + 2}`);
  }
}
assert.deepEqual(data.slice(1, 9).map(row => [row[2], row[3]]), [
  ['VINFAST', 'VF 3'], ['VINFAST', 'VF 5'], ['VINFAST', 'VF 6'], ['VINFAST', 'VF 7'],
  ['VINFAST', 'VF 8'], ['VINFAST', 'VF 9'], ['VINFAST', 'HERIO GREEN'], ['VINFAST', 'LIMO GREEN'],
]);
console.log(`DATA_CHECKS_PASSED=${data.length - 1} rows; Vietnam; 8 non-negative integer month values; 8 VINFAST examples`);
const overview=await wb.inspect({kind:'workbook,sheet,table',maxChars:5000,tableMaxRows:10,tableMaxCols:14});
console.log(overview.ndjson);
const countries=await wb.inspect({kind:'match',searchTerm:'泰国',options:{useRegex:false,maxResults:20},summary:'country residue scan',maxChars:3000});
console.log('THAILAND_MATCHES\n'+countries.ndjson);
const errors=await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!',options:{useRegex:true,maxResults:300},summary:'saved formula error scan',maxChars:3000});
console.log('ERRORS\n'+errors.ndjson);
