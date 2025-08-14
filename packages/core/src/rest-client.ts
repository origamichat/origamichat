import {
  CossistantAPIError,
  type CossistantConfig,
  type PublicWebsiteResponse,
} from "./types";
import { getVisitorId, setVisitorId } from "./visitor-tracker";

export class CossistantRestClient {
  private config: CossistantConfig;
  private baseHeaders: Record<string, string>;
  private publicKey: string;
  private websiteId: string | null = null;
  private visitorId: string | null = null;

  constructor(config: CossistantConfig) {
    this.config = config;

    // Get public key from config or environment variables
    this.publicKey =
      config.publicKey ||
      (typeof process !== "undefined"
        ? process.env.NEXT_PUBLIC_COSSISSTANT_KEY
        : undefined) ||
      (typeof process !== "undefined"
        ? process.env.COSSISSTANT_PUBLIC_KEY
        : undefined) ||
      "";

    if (!this.publicKey) {
      throw new Error(
        "Public key is required. Please provide it in the config or set NEXT_PUBLIC_COSSISSTANT_KEY or COSSISSTANT_PUBLIC_KEY environment variable."
      );
    }

    this.baseHeaders = {
      "Content-Type": "application/json",
      "X-Public-Key": this.publicKey,
    };

    if (config.userId) {
      this.baseHeaders["X-User-ID"] = config.userId;
    }

    if (config.organizationId) {
      this.baseHeaders["X-Organization-ID"] = config.organizationId;
    }
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.apiUrl}${path}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.baseHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new CossistantAPIError({
        code: errorData.code || `HTTP_${response.status}`,
        message: errorData.message || response.statusText,
        details: errorData.details,
      });
    }

    return response.json();
  }

  async getWebsite(): Promise<PublicWebsiteResponse> {
    // Make the request with visitor ID if we have one stored
    const headers: Record<string, string> = {};

    // If we already know the website ID, try to get the visitor ID
    if (this.websiteId) {
      const storedVisitorId = getVisitorId(this.websiteId);
      if (storedVisitorId) {
        headers["X-Visitor-Id"] = storedVisitorId;
      }
    }

    const response = await this.request<PublicWebsiteResponse>("/website", {
      headers,
    });

    // Store the website ID for future requests
    this.websiteId = response.id;

    // Store the visitor ID if we got one
    if (response.visitor?.id) {
      this.visitorId = response.visitor.id;
      setVisitorId(response.id, response.visitor.id);
    }

    return response;
  }

  // Manually prime website and visitor context when the caller already has it
  setWebsiteContext(websiteId: string, visitorId?: string): void {
    this.websiteId = websiteId;
    if (visitorId) {
      this.visitorId = visitorId;
      setVisitorId(websiteId, visitorId);
    }
  }

  async updateConfiguration(config: Partial<CossistantConfig>): Promise<void> {
    if (config.publicKey) {
      this.publicKey = config.publicKey;
      this.baseHeaders["X-Public-Key"] = config.publicKey;
    }

    if (config.userId) {
      this.baseHeaders["X-User-ID"] = config.userId;
    } else if (config.userId === null) {
      const { "X-User-ID": _, ...rest } = this.baseHeaders;
      this.baseHeaders = rest;
    }

    if (config.organizationId) {
      this.baseHeaders["X-Organization-ID"] = config.organizationId;
    } else if (config.organizationId === null) {
      const { "X-Organization-ID": _, ...rest } = this.baseHeaders;
      this.baseHeaders = rest;
    }

    this.config = { ...this.config, ...config };
  }
}
