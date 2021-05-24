import { inject, injectable } from 'inversify';
import axios, { AxiosInstance } from "axios";
import AuthService from './auth.service';
import { lazyInject, TYPES } from './container';
import LoggerService from './logger.service';
import ProtectedMemoryService from './protected-memory.service';
import * as StoredDataTypesEnum from "../enums/stored-data-types.enum";

@injectable()
export class AxiosService {
  #instance: AxiosInstance;
  #url = "http://127.0.0.1:8080/v1/api";
  #refreshed = false;

  /// @ts-ignore
  @lazyInject(TYPES.AuthService) public authService: AuthService;

  constructor(
    @inject(TYPES.LoggerService) 
    private readonly logggerService: LoggerService, 
    @inject(TYPES.ProtectedMemoryService) 
    private readonly protectedMemoryService: ProtectedMemoryService
  ) {
    const instance = axios.create({
      baseURL: this.#url,
    });

    instance.interceptors.response.use(null, async (error) => {
      if (error.response.status === 401) {
        if (this.#refreshed) { this.#refreshed = false; return Promise.reject(error); } 

        const session = await this.protectedMemoryService.getItem(
          StoredDataTypesEnum.SESSION,
          {
            parseJson: true,
          }
        );

        this.logggerService.log('Axios Service', '401 Error');

        const newToken = await this.authService.refresh(session);
        this.authService.authorize(newToken);

        error.config.headers.Authorization = `Bearer ${newToken}`;

        this.#refreshed = true;

        return instance(error.config);

      } else
        return Promise.reject(error); 
    });

    this.#instance = instance;
  }

  get instance() {
    return this.#instance;
  }
}


export default AxiosService;