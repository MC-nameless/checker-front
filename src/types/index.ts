export interface MCExtraText {
  text: string; color?: string; bold?: boolean; italic?: boolean;
  underlined?: boolean; strikethrough?: boolean; obfuscated?: boolean;
}

export interface DNSRecord {
  hostname: string; type: string; data: string;
}

export interface ServerStatus {
  version?: { name: string; protocol: number };
  players?: { max: number; online: number; sample?: { id: string; name: string }[] };
  description?: string | { text: string; extra?: MCExtraText[] };
  favicon?: string;
  debug?: {
    cacheTime: string; hostname: string; ipAddress: string; port: number;
    protocolVersion: string; blockedByMojang: boolean; srvRecord: string;
    pingSuccess: boolean; querySuccess: boolean; queryError?: string;
    geo?: [number, number]; // 目标服务器的经纬度 [Lat, Lng]
  };
  dnsRecords?: DNSRecord[];
}

export interface NodeResult {
  node: string;
  delay_ms: number;
  success: boolean;
  status?: ServerStatus;
  error?: string;
  geo?: [number, number]; // 边缘节点的经纬度 [Lat, Lng]
}

export interface PingResponse {
  target: string;
  results: NodeResult[];
}