import core from "@light-town/core";
import api from "./api.service";

export default class AuthService {
  async createSession(deviceUuid, accountKey, password) {
    const response = await api.auth.createSession({
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

  async startSession(session) {
    const response = await this.$api.auth.startSession(session.uuid, {
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
}
