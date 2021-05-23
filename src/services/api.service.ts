import { injectable } from "inversify";
import Auth from "./api/auth";
import Device from "./api/device";
import KeySets from "./api/key-sets";
import VaultItems from "./api/vault-items";
import Vaults from "./api/vaults";

@injectable()
export default class ApiService {
  constructor(
    public readonly auth: Auth,
    public readonly device: Device,
    public readonly keySets: KeySets,
    public readonly vaultItems: VaultItems,
    public readonly vaults: Vaults
  ) {}
}
