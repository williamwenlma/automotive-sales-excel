# Automotive Sales Excel

汽车销量与注册量 Excel 工作簿项目，包含固定分析模板、越南市场模拟数据生成脚本，以及工作簿检查和预览工具。

## 项目内容

| 文件 | 用途 |
| --- | --- |
| `V4.xlsx` | 汽车市场分析 Excel 母版 |
| `Mingfang_Zhong_20260826_030056_ms4p3jyr.0qy.xlsx` | 现有输入工作簿 |
| `automotive-sales-fixed-template/SKILL.md` | 固定模板的处理规则、业务口径和校验要求 |
| `build_vietnam_workbook.mjs` | 修改输入工作簿的 Data Export，生成越南乘用车注册模拟数据工作簿 |
| `inspect_workbook.mjs` | 检查输入工作簿结构并导出预览 |
| `verify_vietnam_workbook.mjs` | 检查生成工作簿、残留国家名称及公式错误 |
| `outputs/vietnam_simulation/` | 生成的示例工作簿和预览图片 |
| `source_preview.png` | 输入数据预览 |

## 使用说明

1. 使用 Microsoft Excel 打开 `V4.xlsx` 或示例输出工作簿。
2. 固定模板的详细要求见 `automotive-sales-fixed-template/SKILL.md`，包括车型聚合、中国品牌识别、分类排名、市占率和月度环比等。
3. 如需运行 JavaScript 脚本，需准备 Node.js 和可用的 `@oai/artifact-tool` 环境。
4. 当前脚本沿用原工作环境的绝对文件路径。请先将各脚本中的输入、输出路径改为本机路径，再运行：

```sh
node inspect_workbook.mjs
node build_vietnam_workbook.mjs
node verify_vietnam_workbook.mjs
```

`@oai/artifact-tool` 是原工作环境提供的依赖，本仓库不包含该运行环境或 `node_modules`。

## 数据说明

越南示例由脚本使用品牌系数、季节系数和确定性扰动生成，并加入 VINFAST 示例记录，属于模拟数据，不代表官方统计或真实市场销量。

模板规则描述完整分析工作簿的目标要求；当前生成脚本主要修改 `Data Export`，不应据此认定已实现规则文件中的全部计算和校验功能。

临时诊断导出文件不纳入版本控制。
