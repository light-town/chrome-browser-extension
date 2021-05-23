import {  inject, injectable, LazyServiceIdentifer,   } from 'inversify';
import axios, { AxiosInstance } from "axios";
import AuthService from './auth.service';
import { lazyInject, TYPES } from './container';

@injectable()
export class AxiosService {
  #instance: AxiosInstance;
  #url = "http://127.0.0.1:8080/v1/api";

  /// @ts-ignore
  @lazyInject(AuthService) public authService: AuthService;

  constructor() {
    const instance = axios.create({
      baseURL: this.#url,
    });

    instance.interceptors.request.use((config) => {
      return config;
    });

    instance.interceptors.response.use(async (response) => {
      if (response.status === 401) {
        await this.authService.refresh();
      }

      return response;
    });

    this.#instance = instance;
  }

  get instance() {
    return this.#instance;
  }
}


export default AxiosService;