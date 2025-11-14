import { APIRequestContext, APIResponse } from '@playwright/test';
import { ApiHelper } from './api-helper';
import { UserData } from '../helpers/test-data';

export class UserApi extends ApiHelper {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async createAccount(userData: UserData): Promise<APIResponse> {
    const formData = new URLSearchParams();
    Object.entries(userData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await this.request.post('/api/createAccount', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: formData.toString(),
    });

    return response;
  }

  async verifyLogin(email: string, password: string): Promise<APIResponse> {
    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', password);

    const response = await this.request.post('/api/verifyLogin', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: formData.toString(),
    });

    return response;
  }

  async deleteAccount(email: string, password: string): Promise<APIResponse> {
    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', password);

    const response = await this.request.delete('/api/deleteAccount', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: formData.toString(),
    });

    return response;
  }
}
