import { APIRequestContext, APIResponse, expect } from '@playwright/test';

export class ApiHelper {
  constructor(private request: APIRequestContext) {}

  async get(url: string, headers?: Record<string, string>): Promise<APIResponse> {
    return await this.request.get(url, { headers });
  }

  async post(
    url: string,
    body: unknown,
    headers?: Record<string, string>
  ): Promise<APIResponse> {
    return await this.request.post(url, {
      data: body,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
  }

  async put(
    url: string,
    body: unknown,
    headers?: Record<string, string>
  ): Promise<APIResponse> {
    return await this.request.put(url, {
      data: body,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
  }

  async patch(
    url: string,
    body: unknown,
    headers?: Record<string, string>
  ): Promise<APIResponse> {
    return await this.request.patch(url, {
      data: body,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
  }

  async delete(url: string, headers?: Record<string, string>): Promise<APIResponse> {
    return await this.request.delete(url, { headers });
  }

  async verifyStatusCode(response: APIResponse, expectedStatus: number): Promise<void> {
    expect(response.status()).toBe(expectedStatus);
  }

  async getResponseBody<T = unknown>(response: APIResponse): Promise<T> {
    return (await response.json()) as T;
  }

  verifyResponseData(actual: unknown, expected: unknown): void {
    expect(actual).toEqual(expected);
  }
}
