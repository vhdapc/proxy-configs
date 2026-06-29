# Clash / mihomo 模板

本目录用于保存 Sub-Store 调用的 Clash / mihomo 配置模板。

## 文件说明

| 文件 | 用途 |
|---|---|
| `clash4me.yaml` | 常用模板，预计包含原生节点和机场节点相关结构。 |
| `clash-all.yaml` | 备用模板，预计不包含原生节点。 |

## Raw URL 规则

Sub-Store 调用时建议使用 GitHub raw 地址：

```text
https://raw.githubusercontent.com/vhdapc/proxy-configs/main/clash/clash4me.yaml
https://raw.githubusercontent.com/vhdapc/proxy-configs/main/clash/clash-all.yaml
```

## 安全边界

公开仓库中不要保存：

- 机场订阅 URL
- 真实节点 server / port / password / UUID
- GitHub token
- Sub-Store secret
- 任何可直接还原节点的私密信息

如果模板必须出现真实节点，请优先保留在 Gist 私密链接、Sub-Store 本地文件或私有仓库中，不建议公开。
