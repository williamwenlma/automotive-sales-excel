import { spawnSync } from 'node:child_process';
import { access, stat } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
  console.log('Usage / 用法: node demo.mjs [input.xlsx] [output-directory]');
  console.log('Default output / 默认输出: outputs/demo/');
  process.exit(0);
}
if (args.length > 2 || args.some(arg => arg.startsWith('-'))) {
  console.error('Usage / 用法: node demo.mjs [input.xlsx] [output-directory]');
  process.exit(1);
}

const sourcePath = args[0] ? resolve(args[0]) : fileURLToPath(new URL('./Mingfang_Zhong_20260826_030056_ms4p3jyr.0qy.xlsx', import.meta.url));
const outputDir = args[1] ? resolve(args[1]) : fileURLToPath(new URL('./outputs/demo/', import.meta.url));
const outputPath = join(outputDir, '越南乘用车注册模拟数据_2026.xlsx');

try {
  await access(sourcePath);
  if (resolve(sourcePath) === resolve(outputPath)) {
    throw new Error('Choose an output directory that does not overwrite the input / 输出不能覆盖输入文件');
  }
  try {
    await import('@oai/artifact-tool');
  } catch (error) {
    if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error;
    throw new Error('This demo requires an environment providing @oai/artifact-tool. See README.md. / 运行环境需提供 @oai/artifact-tool，详见 README.md。');
  }

  for (const [label, script, scriptArgs] of [
    ['1/2 Generate workbook / 生成工作簿', 'build_vietnam_workbook.mjs', [sourcePath, outputDir]],
    ['2/2 Verify saved workbook / 检查保存结果', 'verify_vietnam_workbook.mjs', [outputPath]],
  ]) {
    console.log(`\n${label}`);
    const result = spawnSync(process.execPath, [fileURLToPath(new URL(`./${script}`, import.meta.url)), ...scriptArgs], { stdio: 'inherit' });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(`${script} failed / 执行失败 (exit: ${result.status}, signal: ${result.signal ?? 'none'})`);
  }

  for (const output of [outputPath, join(outputDir, 'preview.png')]) {
    if ((await stat(output)).size === 0) throw new Error(`Empty output / 输出为空: ${output}`);
  }
  console.log(`\nDemo complete / 演示完成\nWorkbook / 工作簿: ${outputPath}\nPreview / 预览: ${join(outputDir, 'preview.png')}`);
  console.log('Simulated data only / 仅为模拟数据。Review the diagnostic scan output for formula issues / 请查看诊断输出中的公式问题。');
} catch (error) {
  console.error(`Demo failed / 演示失败: ${error.message}`);
  process.exitCode = 1;
}
