import {
  AutoFillAction,
  AutoFillActionTypesEnum,
  AutoFillSelector,
} from "./interfaces";

export class ClickAutoFillAction extends AutoFillAction {
  public constructor(selector: AutoFillSelector, value?: string) {
    super(AutoFillActionTypesEnum.CLICK, selector, value);
  }
}

export class FocusAutoFillAction extends AutoFillAction {
  public constructor(selector: AutoFillSelector, value?: string) {
    super(AutoFillActionTypesEnum.FOCUS, selector, value);
  }
}

export class FillAutoFillAction extends AutoFillAction {
  public constructor(selector: AutoFillSelector, value?: string) {
    super(AutoFillActionTypesEnum.FILL, selector, value);
  }
}
