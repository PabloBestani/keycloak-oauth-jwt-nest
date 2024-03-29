import { HttpMethod } from '../definitions/enums';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';

const httpService = new HttpService();

export async function httpRequest(
  method: HttpMethod,
  url: string,
  options: object,
  body: string | object,
): Promise<AxiosResponse>;
export async function httpRequest(
  method: HttpMethod,
  url: string,
  options: object,
): Promise<AxiosResponse>;

export async function httpRequest(
  method: HttpMethod,
  url: string,
  options?: object,
  body?: string | object,
): Promise<AxiosResponse> {
  try {
    if (method === HttpMethod.GET) {
      const observable = httpService.get(url, options);
      const response = await lastValueFrom(observable);
      if (!response)
        throw new Error(
          `Error attempting to get data (KeycloakService/sendRequest)`,
        );
      return response;
    } else {
      const observable = httpService[method](url, body, options);
      const response = await lastValueFrom(observable);
      if (!response)
        throw new Error(
          `Error attempting to ${method} data (KeycloakService/sendRequest)`,
        );
      return response;
    }
  } catch (error) {
    throw error;
  }
}
