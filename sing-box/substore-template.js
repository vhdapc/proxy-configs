// Sub-Store file script: injects a selected subscription/collection into a sing-box JSON template.
// Deliberately does not log URLs, node objects, passwords, UUIDs, or generated configuration.

const args = $arguments || {};
const parser = ProxyUtils.JSON5 || JSON;
const templateText = $content ?? ($files && $files[0]);

if (!templateText) throw new Error("sing-box template content is empty");
if (!args.name) throw new Error("Set the Sub-Store subscription/collection name in the script parameters");
if (!args.outbound) throw new Error("Set outbound injection rules in the script parameters");

const config = parser.parse(templateText);
const sourceType = /^(1|col|collection|组合)$/i.test(String(args.type || "")) ? "collection" : "subscription";
const artifactResult = await produceArtifact({
  name: args.name,
  type: sourceType,
  platform: "sing-box",
  produceOpts: {
    "include-unsupported-proxy": args.includeUnsupportedProxy === true || args.includeUnsupportedProxy === "true"
  }
});
const artifact = typeof artifactResult === "string" ? JSON.parse(artifactResult) : artifactResult;
const proxies = [...(artifact.outbounds || []), ...(artifact.endpoints || [])];
const proxyTags = proxies.map(proxy => proxy.tag).filter(tag => typeof tag === "string");
if (proxyTags.length === 0) throw new Error(`No sing-box nodes exported from ${sourceType} "${args.name}"`);

// Optional private correction supplied by the Sub-Store file operation URL.
// Format: node_tag🏷server_name🕳node_tag2🏷server_name2
// Keep real node tags and hostnames in Sub-Store parameters instead of the public template.
const tlsServerNameMap = new Map(String(args.tlsServerNameMap || "")
  .split("🕳")
  .map(item => item.trim())
  .filter(Boolean)
  .map(item => item.split("🏷").map(part => part.trim()))
  .filter(parts => parts.length === 2 && parts.every(Boolean)));

for (const proxy of proxies) {
  const serverName = tlsServerNameMap.get(proxy.tag);
  if (serverName && proxy.tls && typeof proxy.tls === "object") proxy.tls.server_name = serverName;
}

const rules = String(args.outbound).split("🕳").map(item => item.trim()).filter(Boolean).map(item => {
  const [outboundPattern, tagPattern = ".*"] = item.split("🏷");
  return [new RegExp(outboundPattern.replace("ℹ️", ""), outboundPattern.includes("ℹ️") ? "i" : ""),
    new RegExp(tagPattern.replace("ℹ️", ""), tagPattern.includes("ℹ️") ? "i" : "")];
});

if (!Array.isArray(config.outbounds)) config.outbounds = [];
for (const outbound of config.outbounds) {
  for (const [outboundRegex, tagRegex] of rules) {
    if (!outboundRegex.test(outbound.tag)) continue;
    if (!Array.isArray(outbound.outbounds)) outbound.outbounds = [];
    const matches = proxyTags.filter(tag => tagRegex.test(tag));
    if (outbound.tag === "🚀 节点选择") outbound.outbounds.unshift(...matches);
    else outbound.outbounds.push(...matches);
  }
  if (Array.isArray(outbound.outbounds)) outbound.outbounds = [...new Set(outbound.outbounds)];
}

const emptyMatchedGroups = config.outbounds.filter(outbound =>
  rules.some(([outboundRegex]) => outboundRegex.test(outbound.tag)) &&
  Array.isArray(outbound.outbounds) && outbound.outbounds.length === 0
);
if (emptyMatchedGroups.length > 0) {
  config.outbounds.push({ tag: "COMPATIBLE", type: "direct" });
  for (const outbound of emptyMatchedGroups) outbound.outbounds.push("COMPATIBLE");
}


// Optional private Nikki mixin routes. Pass as 🕳-separated Clash rule lines in a
// private Sub-Store parameter; private IPs/domains never belong in this public template.
// IP-CIDR's Clash no-resolve flag has no sing-box equivalent and is omitted.
const localRules = String(args.localRules || "").split("🕳").map(item => item.trim()).filter(Boolean);
const routeRuleByType = {
  "DOMAIN": "domain",
  "DOMAIN-SUFFIX": "domain_suffix",
  "DOMAIN-KEYWORD": "domain_keyword",
  "IP-CIDR": "ip_cidr",
  "IP-CIDR6": "ip_cidr"
};
const privateRules = localRules.map(line => {
  const [kind, value, target] = line.split(",").map(part => part.trim());
  const field = routeRuleByType[kind];
  if (!field || !value || !target) throw new Error("Unsupported local rule in localRules parameter");
  const outbound = target === "DIRECT" ? "直连" : target;
  return { [field]: [value], action: "route", outbound };
});
const availableTags = new Set(config.outbounds.map(outbound => outbound.tag).concat(proxyTags));
for (const rule of privateRules) {
  if (!availableTags.has(rule.outbound)) throw new Error("Unknown outbound in localRules parameter");
}
config.route.rules.splice(2, 0, ...privateRules);

config.outbounds.push(...(artifact.outbounds || []));
if (!Array.isArray(config.endpoints)) config.endpoints = [];
config.endpoints.push(...(artifact.endpoints || []));
$content = JSON.stringify(config, null, 2);
