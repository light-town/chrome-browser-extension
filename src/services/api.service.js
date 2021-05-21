import axios from "./axios.service";
export class Auth {
  createSession({ accountKey, deviceUuid }) {
    return axios
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
    return axios
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
    return axios.get("/auth/csrf-token").then((response) => response.data);
  }
}

export class Devices {
  registerDevice({ os }) {
    return axios.post("/devices", { os }).then((response) => response.data);
  }
}

export class Api {
  auth = new Auth();
  devices = new Devices();
}

export default new Api();
