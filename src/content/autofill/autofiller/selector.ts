import { AutoFillSelector, AutoFillSelectorTypesEnum } from "./interfaces";

export class UuidAutoFillSelector extends AutoFillSelector {
  public constructor(uuid: string) {
    super(AutoFillSelectorTypesEnum.UUID, uuid);
  }
}

export class QueryAutoFillSelector extends AutoFillSelector {
  public constructor(uuid: string) {
    super(AutoFillSelectorTypesEnum.QUERY, uuid);
  }
}
