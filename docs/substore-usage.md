# Sub-Store 使用说明

这个仓库的模板设计目标是：

- GitHub 公开模板负责结构和规则。
- Sub-Store 负责订阅、节点、变量和最终生成。
- 客户端或路由器只订阅 Sub-Store 生成后的最终链接。

## 推荐流程

```text
GitHub public template
        ↓
Sub-Store 导入模板 + 订阅 + 变量
        ↓
生成 Clash / mihomo 最终配置
        ↓
Nikki / mihomo / 其他客户端调用最终配置
```

## 为什么不建议私有仓库直接调用

Sub-Store 通过 URL 下载模板。私有 GitHub 仓库需要认证，通常要把 GitHub token 放到请求 header 或 URL 参数里。

这会带来新的风险：token 可能出现在 Sub-Store 配置、同步数据、日志、截图、客户端备份里。

因此更稳妥的方案是：

```text
公开仓库：只放脱敏模板
Sub-Store：保存真实订阅和最终生成逻辑
私有备份：只在必要时保存完整环境说明
```

## 模板更新建议

每次修改模板后，建议按顺序检查：

1. Sub-Store 能否正常拉取 raw URL。
2. Sub-Store 能否正常生成最终配置。
3. mihomo / Nikki 是否能正常加载配置。
4. 国内直连、国外分流、Apple / Microsoft / AI / 流媒体等策略组是否仍符合预期。
5. 指定 Wi-Fi、DNS、漏网之鱼等逻辑是否没有被破坏。
