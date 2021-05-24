import { inject, injectable, LazyServiceIdentifer } from "inversify";
import core from "@light-town/core";
import AxiosService from "./axios.service";
import StorageService from "./storage.service";
import ProtectedMemoryService from "./protected-memory.service";
import ApiService from "./api.service";
import * as StoredDataTypesEnum from "../enums/stored-data-types.enum";
import { TYPES } from "./container";

@injectable()
export class AuthService {
  constructor(
    @inject(TYPES.AxiosService)
    private readonly axiosService: AxiosService,
    @inject(TYPES.StorageService)
    private readonly storageService: StorageService,
    @inject(TYPES.ProtectedMemoryService)
    private readonly protectedMemoryService: ProtectedMemoryService,
    @inject(TYPES.ApiService) private readonly apiService: ApiService
  ) {}

  async loadCsrfToken(): Promise<void> {
    let csrfToken = await this.storageService.getItem(
      StoredDataTypesEnum.X_CSRF_TOKEN
    );

    if (!csrfToken) {
      csrfToken = await this.getCsrfToken();
      await this.storageService.setItem(
        StoredDataTypesEnum.X_CSRF_TOKEN,
        csrfToken
      );
    }

    this.axiosService.instance.defaults.headers.common[
      "X-CSRF-TOKEN"
    ] = csrfToken;
  }

  async createSession(
    deviceUuid: string,
    accountKey: string,
    password: string
  ) {
    const response = await this.apiService.auth.createSession({
      accountKey: accountKey,
      deviceUuid: deviceUuid,
    });

    const clientEphemeralKeyPair = core.srp.client.generateEphemeralKeyPair();
    const privateKey = core.srp.client.derivePrivateKey(
      accountKey,
      password,
      response.data.salt
    );

    const clientSRPSession = core.srp.client.deriveSession(
      clientEphemeralKeyPair.secret,
      response.data.serverPublicEphemeral,
      response.data.salt,
      accountKey,
      privateKey
    );

    return {
      uuid: response.data.sessionUuid,
      srp: clientSRPSession,
      ephemeralKeyPair: clientEphemeralKeyPair,
      serverPublicEphemeralKey: response.data.serverPublicEphemeral,
      verifing: {
        ...response.data.sessionVerification,
      },
    };
  }

  async startSession(session: any) {
    const response = await this.apiService.auth.startSession(session.uuid, {
      clientPublicEphemeralKey: session.ephemeralKeyPair.public,
      clientSessionProofKey: session.srp.proof,
    });

    core.srp.client.verifySession(
      session.ephemeralKeyPair.public,
      session.srp,
      response.data.serverSessionProof
    );

    return {
      uuid: session.uuid,
      token: response.data.token,
    };
  }

  async getCsrfToken() {
    const response = await this.apiService.auth.getCsrfToken();

    if (response.statusCode !== 200) return;

    return response.data["X-CSRF-TOKEN"];
  }

  async authorize(token: string) {
    this.axiosService.instance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;
  }

  get currentAccount() {
    return this.storageService.getItem(StoredDataTypesEnum.CURRENT_ACCOUNT);
  }

  set currentAccount(val) {
    this.storageService.setItem(StoredDataTypesEnum.CURRENT_ACCOUNT, val);
  }

  async refresh(session) {
    const response = await this.apiService.auth.resfreshToken(session.uuid);

    if (response.statusCode !== 201) {
      return null;
    }

    debugger;

    return response.data.token;
  }
}

export default AuthService;
