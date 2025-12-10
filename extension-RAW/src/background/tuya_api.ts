/**
 * Tuya Open API Client (Browser Native)
 */

export class TuyaAPI {
  baseUrl: string;
  accessId: string;
  accessSecret: string;
  token: string = "";
  refreshToken: string = "";
  tokenExpireTime: number = 0;

  constructor(region: string, accessId: string, accessSecret: string) {
    this.baseUrl = this.getRegionUrl(region);
    this.accessId = accessId;
    this.accessSecret = accessSecret;
  }

  getRegionUrl(region: string) {
    switch (region) {
      case "CN": return "https://openapi.tuyacn.com";
      case "US": return "https://openapi.tuyaus.com";
      case "EU": return "https://openapi.tuyaeu.com";
      case "IN": return "https://openapi.tuyain.com";
      default: return "https://openapi.tuyaus.com";
    }
  }

  async getAccessToken() {
    if (this.token && Date.now() < this.tokenExpireTime) return this.token;

    const method = "GET";
    const path = "/v1.0/token?grant_type=1";
    const headers = await this.signRequest(method, path, "", "");
    
    try {
      const res = await fetch(`${this.baseUrl}${path}`, { method, headers });
      const data = await res.json();
      if (data.success) {
        this.token = data.result.access_token;
        this.refreshToken = data.result.refresh_token;
        this.tokenExpireTime = Date.now() + (data.result.expire_time * 1000) - 60000;
        return this.token;
      }
      throw new Error(data.msg);
    } catch (e) {
      console.error("Tuya Token Error", e);
      throw e;
    }
  }

  async getDeviceStatus(deviceId: string) {
    await this.getAccessToken();
    const method = "GET";
    const path = `/v1.0/devices/${deviceId}/status`;
    const headers = await this.signRequest(method, path, "", this.token);
    
    const res = await fetch(`${this.baseUrl}${path}`, { method, headers });
    return await res.json();
  }

  async sendCommand(deviceId: string, commands: any[]) {
    await this.getAccessToken();
    const method = "POST";
    const path = `/v1.0/devices/${deviceId}/commands`;
    const body = JSON.stringify({ commands });
    const headers = await this.signRequest(method, path, body, this.token);
    
    const res = await fetch(`${this.baseUrl}${path}`, { method, headers, body });
    return await res.json();
  }

  // --- Crypto Helpers ---

  async signRequest(method: string, path: string, body: string, token: string) {
    const t = Date.now().toString();
    const nonce = ""; // Not strictly required for basic sig
    const contentHash = await this.sha256(body);
    const stringToSign = [method, contentHash, "", path].join("\n");
    const signStr = this.accessId + token + t + nonce + stringToSign;
    const sign = await this.hmacSha256(this.accessSecret, signStr);

    return {
      "client_id": this.accessId,
      "sign": sign.toUpperCase(),
      "t": t,
      "sign_method": "HMAC-SHA256",
      "access_token": token,
      "Content-Type": "application/json"
    };
  }

  async sha256(str: string) {
    const msgBuffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    return this.buf2hex(hashBuffer);
  }

  async hmacSha256(key: string, data: string) {
    const enc = new TextEncoder();
    const keyData = await crypto.subtle.importKey(
      "raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", keyData, enc.encode(data));
    return this.buf2hex(signature);
  }

  buf2hex(buffer: ArrayBuffer) {
    return [...new Uint8Array(buffer)]
      .map(x => x.toString(16).padStart(2, "0"))
      .join("");
  }
}
