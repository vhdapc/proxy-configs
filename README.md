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
├── docs/
│   └── substore-usage.md
└── README.md
```

## 使用原则

1. 公开仓库只放模板，不放真实订阅和节点密钥。
2. Sub-Store 负责导入模板、订阅和变量，并生成最终配置。
3. 每次修改模板后，优先通过 Sub-Store 生成测试配置，再同步到客户端或路由器。

## 已迁移模板

| 文件 | 原 Gist | 状态 | Raw URL |
|---|---|---|---|
| `clash/clash4me.yaml` | `clash4me` | 已导入 | `https://raw.githubusercontent.com/vhdapc/proxy-configs/main/clash/clash4me.yaml` |
| `clash/clash-all.yaml` | `clash-all` | 已导入 | `https://raw.githubusercontent.com/vhdapc/proxy-configs/main/clash/clash-all.yaml` |
