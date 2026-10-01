# proxy-configs

用于管理 Sub-Store 调用的代理配置模板。

当前仓库定位：

- 公开保存可被 Sub-Store 直接拉取的模板文件。
- 不保存机场订阅链接、真实节点、UUID、password、token、secret 等敏感信息。
- 最终配置仍由 Sub-Store 在本地或服务端生成。

## 目录规划

```text
proxy-configs/
├── clash/
│   ├── clash4me.yaml        # 常用 Clash / mihomo 模板：原生节点 + 机场节点
│   ├── clash-all.yaml       # 备用 Clash / mihomo 模板：不含原生节点
│   └── README.md
├── loon/
│   ├── loon.conf            # Loon 指定 Wi-Fi 自动直连模板
│   └── README.md
├── sing-box/
│   ├── momo.json            # Momo / OpenWrt 模板
│   ├── android-sfa.json     # Android SFA 模板
│   └── substore-template.js # Sub-Store 文件脚本：拉取节点并注入模板
├── docs/
│   ├── substore-usage.md
│   └── sing-box-substore-draft.md
└── README.md
```

## 使用原则

1. 公开仓库只放模板，不放真实订阅和节点密钥。
2. Sub-Store 负责导入模板、订阅和变量，并生成最终配置。
3. 每次修改模板后，优先通过 Sub-Store 生成测试配置，再同步到客户端或路由器。

## 已迁移模板

| 文件 | 类型 | 版本 | 状态 | Raw URL |
|---|---|---|---|---|
| `clash/clash4me.yaml` | Clash / mihomo | `v2026.07.08-1` | 已导入 | `https://raw.githubusercontent.com/vhdapc/proxy-configs/main/clash/clash4me.yaml` |
| `clash/clash-all.yaml` | Clash / mihomo | `v2026.07.08-1` | 已导入 | `https://raw.githubusercontent.com/vhdapc/proxy-configs/main/clash/clash-all.yaml` |
| `loon/loon.conf` | Loon | `v2026.07.11-1` | 已导入 | `https://raw.githubusercontent.com/vhdapc/proxy-configs/main/loon/loon.conf` |

## sing-box 模板

提供 Momo/OpenWrt 与 Android SFA 两份无节点凭据的 sing-box 模板，以及 Sub-Store 文件脚本。规则迁移以 `clash/clash4me.yaml` 为准。Sub-Store 可读取 GitHub Raw 模板，再通过 `produceArtifact` 导入你选择的单订阅节点；不要把生成后的含节点配置或私人订阅信息提交到仓库。分组参数、映射边界与验证步骤见 [`docs/sing-box-substore-draft.md`](docs/sing-box-substore-draft.md)。
