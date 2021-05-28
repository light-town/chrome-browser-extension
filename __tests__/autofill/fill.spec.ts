/**
 * @jest-environment jsdom
 */

import "reflect-metadata";
import AutoFiller from "~/content/autofill/autofiller";
import DOM from "~/content/autofill/autofiller/dom";
import {
  AutoFillField,
  AutoFillPageDetails,
} from "~/content/autofill/autofiller/interfaces";
import AutoFillService, { ItemField } from "~/services/autofill.service";
import container from "~/services/container";
import createDefaultFormField from "./helpers/create-default-form-field.helper";
import createDefaultForm from "./helpers/create-default-form.helper";

export const DEFAULT_URL = "http://localhost/";

describe("[Getting Form Fields] ...", () => {
  let autofiller: AutoFiller;
  let autoFillService: AutoFillService;

  beforeAll(() => {
    container.bind<AutoFiller>(AutoFiller).toSelf();
    container.bind<DOM>(DOM).toSelf();

    container.bind<AutoFillService>(AutoFillService).toSelf();

    autofiller = container.get<AutoFiller>(AutoFiller);
    autoFillService = container.get<AutoFillService>(AutoFillService);
  });

  it("should return collected data of form fields with ids", () => {
    const [form, formElement] = createDefaultForm();
    const [usernameField, usernameFieldElement] = createDefaultFormField({
      uuid: "__field_0__",
      elementNumber: 0,
      form: form.uuid,
      value: "",
      html: {
        id: "username-field",
        type: "text",
      },
      labels: {},
      properties: {
        viewable: true,
        visible: true,
      },
    });

    const [passwordField, passwordFieldElement] = createDefaultFormField({
      uuid: "__field_1__",
      elementNumber: 1,
      form: form.uuid,
      value: "",
      html: {
        id: "password-field",
        type: "password",
      },
      labels: {},
      properties: {
        viewable: true,
        visible: true,
      },
    });

    formElement.appendChild(usernameFieldElement);
    formElement.appendChild(passwordFieldElement);
    document.body.appendChild(formElement);

    const itemsFields: ItemField[] = [
      {
        id: "__0",
        fieldName: "Username",
        name: "Username",
        value: "name",
        position: 0,
      },
      {
        id: "__1",
        fieldName: "Password",
        name: "Password",
        value: "passwd",
        position: 0,
      },
    ];

    const pageDetails: AutoFillPageDetails = {
      document: {
        uuid: "__document_0__",
        title: "",
        url: DEFAULT_URL,
      },
      tab: {
        url: DEFAULT_URL,
      },
      page: {
        title: "",
        url: DEFAULT_URL,
      },
      forms: {
        [form.uuid]: form,
      },
      fields: [usernameField, passwordField],
      collectedTimestamp: Date.now(),
    };
    const autoFillScript = autoFillService.fill(pageDetails, itemsFields);

    autofiller.fill(document, autoFillScript);

    expect(usernameFieldElement.value).toStrictEqual(itemsFields[0].value);
    expect(passwordFieldElement.value).toStrictEqual(itemsFields[1].value);
  });

  it("should return collected data of form fields with names", () => {
    const [form, formElement] = createDefaultForm();
    const [usernameField, usernameFieldElement] = createDefaultFormField({
      uuid: "__field_0__",
      elementNumber: 0,
      form: form.uuid,
      value: "",
      html: {
        type: "text",
        name: "username",
      },
      labels: {},
      properties: {
        viewable: true,
        visible: true,
      },
    });

    const [passwordField, passwordFieldElement] = createDefaultFormField({
      uuid: "__field_1__",
      elementNumber: 1,
      form: form.uuid,
      value: "",
      html: {
        type: "password",
        name: "password",
      },
      labels: {},
      properties: {
        viewable: true,
        visible: true,
      },
    });

    formElement.appendChild(usernameFieldElement);
    formElement.appendChild(passwordFieldElement);
    document.body.appendChild(formElement);

    const itemsFields: ItemField[] = [
      {
        id: "__0",
        fieldName: "Username",
        name: "Username",
        value: "name",
        position: 0,
      },
      {
        id: "__1",
        fieldName: "Password",
        name: "Password",
        value: "passwd",
        position: 0,
      },
    ];

    const pageDetails: AutoFillPageDetails = {
      document: {
        uuid: "__document_0__",
        title: "",
        url: DEFAULT_URL,
      },
      tab: {
        url: DEFAULT_URL,
      },
      page: {
        title: "",
        url: DEFAULT_URL,
      },
      forms: {
        [form.uuid]: form,
      },
      fields: [usernameField, passwordField],
      collectedTimestamp: Date.now(),
    };
    const autoFillScript = autoFillService.fill(pageDetails, itemsFields);

    autofiller.fill(document, autoFillScript);

    expect(usernameFieldElement.value).toStrictEqual(itemsFields[0].value);
    expect(passwordFieldElement.value).toStrictEqual(itemsFields[1].value);
  });

  it("should return collected data of form fields with only types", () => {
    const [form, formElement] = createDefaultForm();
    const [usernameField, usernameFieldElement] = createDefaultFormField({
      uuid: "__field_0__",
      elementNumber: 0,
      form: form.uuid,
      value: "",
      html: {
        type: "text",
      },
      labels: {},
      properties: {
        viewable: true,
        visible: true,
      },
    });

    const [passwordField, passwordFieldElement] = createDefaultFormField({
      uuid: "__field_1__",
      elementNumber: 1,
      form: form.uuid,
      value: "",
      html: {
        type: "password",
      },
      labels: {},
      properties: {
        viewable: true,
        visible: true,
      },
    });

    formElement.appendChild(usernameFieldElement);
    formElement.appendChild(passwordFieldElement);
    document.body.appendChild(formElement);

    const itemsFields: ItemField[] = [
      {
        id: "__0",
        fieldName: "Username",
        name: "Username",
        value: "name",
        position: 0,
      },
      {
        id: "__1",
        fieldName: "Password",
        name: "Password",
        value: "passwd",
        position: 0,
      },
    ];

    const pageDetails: AutoFillPageDetails = {
      document: {
        uuid: "__document_0__",
        title: "",
        url: DEFAULT_URL,
      },
      tab: {
        url: DEFAULT_URL,
      },
      page: {
        title: "",
        url: DEFAULT_URL,
      },
      forms: {
        [form.uuid]: form,
      },
      fields: [usernameField, passwordField],
      collectedTimestamp: Date.now(),
    };
    const autoFillScript = autoFillService.fill(pageDetails, itemsFields);

    autofiller.fill(document, autoFillScript);

    expect(usernameFieldElement.value).toStrictEqual(itemsFields[0].value);
    expect(passwordFieldElement.value).toStrictEqual(itemsFields[1].value);
  });
});
