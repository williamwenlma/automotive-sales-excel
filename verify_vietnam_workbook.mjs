import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';
const path='C:/Users/13728/Desktop/gac/outputs/vietnam_simulation/越南乘用车注册模拟数据_2026.xlsx';
const wb=await SpreadsheetFile.importXlsx(await FileBlob.load(path));
const overview=await wb.inspect({kind:'workbook,sheet,table',maxChars:5000,tableMaxRows:10,tableMaxCols:14});
console.log(overview.ndjson);
const countries=await wb.inspect({kind:'match',searchTerm:'泰国',options:{useRegex:false,maxResults:20},summary:'country residue scan',maxChars:3000});
console.log('THAILAND_MATCHES\n'+countries.ndjson);
const errors=await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!',options:{useRegex:true,maxResults:300},summary:'saved formula error scan',maxChars:3000});
console.log('ERRORS\n'+errors.ndjson);
