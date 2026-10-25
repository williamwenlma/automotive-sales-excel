# Vietnam Simulation Demo / 越南市场模拟演示

[项目首页 / Project home](../README.md)

## 中文演示

### 直接查看

1. 下载 [示例工作簿](../outputs/vietnam_simulation/越南乘用车注册模拟数据_2026.xlsx)，使用 Excel 打开。
2. 进入 `Data Export` 工作表，检查 B 列国家为“越南”。
3. 查看第 2–9 行的 8 个 VINFAST 车型，G:N 为 2025 年 12 月至 2026 年 7 月的模拟注册量。
4. 对照下面的结果截图，也可查看 [输入截图](../source_preview.png)。

![模拟结果 / Simulated output](../outputs/vietnam_simulation/preview.png)

| 示例车型 / Model | 2025 年 12 月 / Dec 2025 | 2026 年 7 月 / Jul 2026 |
| --- | ---: | ---: |
| VINFAST VF 3 | 4,220 | 4,870 |
| VINFAST VF 5 | 3,680 | 4,390 |
| VINFAST VF 6 | 2,210 | 2,710 |
| VINFAST LIMO GREEN | 620 | 1,050 |

以上均为模拟数值，可用于了解文件结构与生成流程。

### 自己运行

准备 Node.js 20+ 和提供 `@oai/artifact-tool` 的运行环境，在项目根目录执行：

```sh
node demo.mjs
```

演示依次生成工作簿与图片，再重新导入保存的工作簿进行数据检查。数据检查通过时输出 `DATA_CHECKS_PASSED=...`；生成和检查过程正常结束时输出 `Demo complete / 演示完成`，并列出工作簿及预览图片路径。检查失败会返回非零退出码。国家残留及公式错误扫描会另外打印诊断结果，需要查看这些结果；“演示完成”并不表示所有分析公式均已验证。

默认输出位于 `outputs/demo/`，不会改写随附输入、`V4.xlsx` 或现成示例。重复执行会覆盖该输出目录中的同名文件。输入格式要求和自定义路径用法见 [首页](../README.md#快速体验)。

## English walkthrough

### Explore the prepared example

1. Download the [sample workbook](../outputs/vietnam_simulation/越南乘用车注册模拟数据_2026.xlsx) and open it in Excel.
2. Open `Data Export` and confirm that column B contains `越南` (Vietnam).
3. Rows 2–9 contain eight VINFAST examples. Columns G:N contain simulated registrations for December 2025 through July 2026.
4. Compare the output screenshot above with the [input preview](../source_preview.png).

The table above shows example volumes for VF 3, VF 5, VF 6, and LIMO GREEN. All values are simulated and illustrate the file structure and generation workflow.

### Run it yourself

With Node.js 20+ and an environment providing `@oai/artifact-tool`, run from the project root:

```sh
node demo.mjs
```

The demo generates a workbook and preview, then imports the saved workbook to check its data. Successful data checks print `DATA_CHECKS_PASSED=...`. When generation and checks finish normally, it prints `Demo complete / 演示完成` with output paths. A failed check returns a nonzero exit code. Country-residue and formula-error scans print separate diagnostic results for review; demo completion does not mean every analysis formula has been verified.

The default output directory is `outputs/demo/`. The included input, `V4.xlsx`, and the prepared example remain unchanged. Rerunning overwrites files with the same names in that output directory. See the [main README](../README.md#quick-start) for input requirements and custom paths.
