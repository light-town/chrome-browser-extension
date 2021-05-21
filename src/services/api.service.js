import AxiosService from "./axios.service";
export class Auth {
  createSession({ accountKey, deviceUuid }) {
    return AxiosService.post("/auth/sessions", {
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
    return AxiosService.post(`/auth/sessions/${sessionUuid}/start`, {
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
    return AxiosService.get("/auth/csrf-token").then(
      (response) => response.data
    );
  }
}

export class Devices {
  registerDevice({ os }) {
    return AxiosService.post("/devices", { os }).then(
      (response) => response.data
    );
  }
}

export class KeySets {
  getKeySets() {
    return AxiosService.get(`/key-sets`).then((response) => response.data);
  }

  getPrimaryKeySet() {
    return AxiosService.get(`/key-sets?primary=true`).then(
      (response) => response.data
    );
  }
}

export class Api {
  auth = new Auth();
  devices = new Devices();
  keySets = new KeySets();
}

export default new Api();
