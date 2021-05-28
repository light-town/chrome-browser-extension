export class AutoFillField {
  uuid: string;
  value: string;
  form: string;
  html: {
    id?: string;
    name?: string;
    className?: string;
    placeholder?: string;
    tabindex?: number;
    title?: string;
    rel?: string;
    type?: "password" | "text" | "email" | "tel";
  };
  labels: {
    top?: string;
    left?: string;
    right?: string;
    tag?: string;
    aria?: string;
    data?: string;
  };
  properties: {
    maxLength?: number;
    readonly?: boolean;
    disabled?: boolean;
    visible?: boolean;
    viewable?: boolean;
  };
  autoCompleteType?: "on" | "off" | "current-password" | "new-password";
  selectInfo?: {
    options: any;
  };
  checked?: boolean;
  elementNumber: number;

  public constructor() {
    this.html = {};
    this.labels = {};
    this.properties = {};
  }
}

export type AutoFillMethodForm = "post" | "get" | "delete" | "patch" | "put";

export class AutoFillForm {
  uuid: string;
  html: {
    id?: string;
    name?: string;
    action?: string;
    method?: AutoFillMethodForm;
  };

  public constructor() {
    this.html = {};
  }
}

export class AutoFillPageDetails {
  document: {
    uuid: string;
    title: string;
    url: string;
  };
  page: {
    title: string;
    url: string;
  };
  tab: {
    url: string;
  };
  forms: { [id: string]: AutoFillForm };
  fields: AutoFillField[];
  collectedTimestamp: number;
}

export class AutoFillScript {
  documentUUID: any = {};
  actions: AutoFillAction[] = [];
  properties: any = {};
  // options: any = {};
  // metadata: any = {};
  // autosubmit: any = null;

  constructor(documentUUID: string) {
    this.documentUUID = documentUUID;
  }
}

export enum AutoFillSelectorTypesEnum {
  UUID = "UUID",
  QUERY = "QUERY",
}

export class AutoFillSelector {
  public constructor(
    public readonly type: AutoFillSelectorTypesEnum,
    public readonly value: string
  ) {}
}

export enum AutoFillActionTypesEnum {
  CLICK = "CLICK",
  FOCUS = "FOCUS",
  FILL = "FILL",
}

export class AutoFillAction {
  public constructor(
    public readonly type: AutoFillActionTypesEnum,
    public readonly selector: AutoFillSelector,
    public readonly value?: string
  ) {}
}
