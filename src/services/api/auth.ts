import { inject, injectable } from "inversify";
import AxiosService from "../axios.service";
import { TYPES } from "../container";

@injectable()
export default class Auth {
  constructor(
    @inject(TYPES.AxiosService) private readonly axiosService: AxiosService
  ) {}

  createSession({ accountKey, deviceUuid }) {
    return this.axiosService.instance
      .post("/auth/sessions", {
        accountKey,
        deviceUuid,
      })
      .then((response) => response.data)
      .catch(({ response }) => {
        throw response.data;
      });
  }

  startSession(
    sessionUuid,
    { clientPublicEphemeralKey, clientSessionProofKey }
  ) {
    return this.axiosService.instance
      .post(`/auth/sessions/${sessionUuid}/start`, {
        sessionUuid,
        clientPublicEphemeralKey,
        clientSessionProofKey,
      })
      .then((response) => response.data)
      .catch(({ response }) => {
        throw response.data;
      });
  }

  getCsrfToken() {
    return this.axiosService.instance
      .get("/auth/csrf-token")
      .then((response) => response.data);
  }

  resfreshToken(sessionUuid) {
    return this.axiosService.instance
      .post(`/auth/sessions/${sessionUuid}/refresh-token`)
      .then((response) => response.data);
  }
}
