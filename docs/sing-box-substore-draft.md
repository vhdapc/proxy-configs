# sing-box 模板与 Sub-Store 使用

本目录模板以仓库中的 `clash/clash4me.yaml` 为迁移基准；`clash-all.yaml` 与 Sub-Store 的备用组合 `all` 不参与验证或节点来源。模板不包含真实节点、订阅地址或凭据。

| 文件 | 用途 |
|---|---|
| `sing-box/momo.json` | OpenWrt Momo：保留 Momo 需要的 DNS/HTTP/SOCKS/redirect/tproxy/TUN 入站；TUN 的 `auto_route`、`auto_redirect` 关闭，由 Momo 管理透明代理。家庭 LAN 来源网段未写入公开模板；如需按来源设备分流，请在私有配置中添加自己的网段规则。 |
| `sing-box/android-sfa.json` | Android sing-box for Android：独立 TUN；不含路由器 DNS 入站及 LAN 来源地址规则。 |
| `sing-box/substore-template.js` | Sub-Store 文件脚本：导出所选订阅/组合的 sing-box 节点并注入相应 selector/urltest。 |

## Sub-Store 生成

将对应 JSON 作为远程文件模板，添加本目录的 JS 为文件操作脚本，在脚本参数中填写 `type`、`name`、`outbound`；本地 Nikki 启动规则可另以 `localRules` 私有参数传入，不能写入公开模板。参数 `name` 填写你在 Sub-Store 中实际存在且单独可用的订阅名称，`type` 设为单订阅；不要选当前有问题的备用组合订阅。组合订阅保持留存备用，不作为本方案的数据源。

`outbound` 参数使用脚本识别的 `🕳` 分隔各组规则、`🏷` 分隔组名与节点标签正则。可复制以下单行参数（地区筛选兼容中英文节点标签；按自己的实际命名微调）：

```text
🚀 节点选择🏷ℹ️(原生|Native)🕳手动选择🏷^(?!.*(?:应急|倍率|V3)).+$🕳🇭🇰 香港节点🏷ℹ️(港|HK|Hong Kong|HongKong)🕳🇯🇵 日本节点🏷ℹ️(日本|东京|大阪|JP|Japan)🕳🇺🇸 美国节点🏷ℹ️(美|洛杉矶|圣何塞|US|United States)
```

模板会在未匹配的地区组中加入 `COMPATIBLE` 直连占位，以避免空组；它不是可用代理节点。导入后检查组成员再启用。人工组排除表达式和地区筛选请按你的节点标签微调。手动组包含全部符合筛选条件的节点。节点选择组通过私有的标签筛选参数把原生节点置顶，再提供日本、美国、香港、国外通用和手动组作为手动候选；该组不是故障切换。专线若 Sub-Store 已以一个 SS2022 出站表示，则作为普通节点导入；如果专线需要多跳串联，应在 Sub-Store 中先确认它导出为可用链路，客户端模板不会自行创建三跳链。

脚本遵循 Sub-Store `produceArtifact` 文件脚本能力；不打印订阅 URL、节点对象、密码、UUID、密钥或完整生成配置。公开仓库仅存模板和脚本，生成后的含节点配置应留在本地或私有存储。

## 从 clash4me 迁移的策略

- 策略组按用途排列为节点选择、国外通用、手动选择、Google/AI、Meta/Muse、YouTube、Emby、Telegram、Twitter、Apple、Microsoft、PayPal/加密货币、游戏、漏网流量、纯 IP，地区组置于末尾。节点选择与国外通用均为手动 selector，不提供自动故障切换。
- 可映射的官方 sing-geosite 规则集继续使用 SRS；Clash 私有 provider / YAML 文件不可直接作为 sing-box SRS 使用。其余常用域名以模板中的内联域名匹配覆盖。未转换的 ASN-IP 规则及 APNs IP 段没有伪造成域名规则：纯 IP 的 Telegram/Google/Cloudflare/Microsoft ASN 仍需另行转成并维护 IP-CIDR SRS，Apple 推送目前只按 `push.apple.com` 域名分流。
- Clash 的 fallback/url-test/选择组无法与 sing-box 的 selector/urltest 完全等价：当前将自动测速组和地区测速组作为 selector 可选成员，保持选择自由度，不声称复制了 Clash fallback 状态机。
- 按当前使用目标，不提供广告拦截策略组或 AdGuard 专用规则；Clash 中的 `PASS`（继续检查后续规则）及部分 REJECT-DROP/REJECT 细节没有完全对应的 sing-box outbound 语义。
- 下载规则以 sniff 出的 BitTorrent 协议直连覆盖；没有声称覆盖 Clash Download provider 的全部域名。
- 保留微信域名直连、网易云/Bilibili/电商直连、Netflix/Bahamut 经国外通用、Twitter、GitHub、雀魂/Yostar/Adjust 遥测阻断、特殊域名、国外通用集、CN IP 直连以及纯 IP 专组。国内媒体规则直连。域名规则不等于原 Clash provider 的全量逐条一致。
- 保留 Clash 中注释状态的海外 QUIC 禁止规则为“关闭”状态：模板 sniff QUIC 仅用于识别，不拒绝 UDP/443，确保可以测试 HTTP/3/QUIC。STUN、3478、19302 与 853 的限制仍单独存在。
- 出于公开仓库隐私保护，Momo 与 Android 公共模板均未包含 Clash 的 `SRC-IP-CIDR` 私有 LAN 规则及私有启动分流规则；如需该策略，请只在本地私有副本中添加自己的来源网段，并先验证 Momo 是否能识别原始客户端地址。

## 检查记录与启用顺序

2026-10-01 已分别对两个可用的单订阅进行 sing-box 平台导出与模板注入测试；地区筛选和 Sub-Store 生成链路可用。备用组合订阅报错，按用户指示忽略并留存备用。为避免公开具体订阅和节点元数据，仓库不记录订阅名、节点名称及节点数量。

下一步先在 Sub-Store 预览生成结果，确认节点/策略组成员；再用目标版本的 `sing-box check` 做 schema 检查，之后才在 Android 单独验证；Momo 先做配置兼容性和单设备测试，不要让 Momo 与 Nikki 同时接管透明代理。每次变更前保留 Nikki 配置/回退路径。公开模板不等于已在用户设备启用或验证。

本地 JSON/脚本结构测试不能替代目标客户端内核的 `check`、规则集在线下载与设备实测；如无匹配版本的检查器，不应把模板标记为已实机验证。
