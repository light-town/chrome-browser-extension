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
import container from "~/services/container";
import createDefaultForm from "./helpers/create-default-form.helper";
import createFormFieldHelper from "./helpers/create-form-field.helper";

export const DEFAULT_URL = "http://localhost/";

describe("[Getting Form Fields] ...", () => {
  it("should return collected data of form fields", () => {
    container.bind<AutoFiller>(AutoFiller).toSelf();
    container.bind<DOM>(DOM).toSelf();

    const autofiller = container.get<AutoFiller>(AutoFiller);

    const [form, formElement] = createDefaultForm();
    document.body.append(formElement);

    const field = new AutoFillField();
    field.uuid = "__field_0__";
    field.form = form.uuid;
    field.value = "";
    field.properties = {
      disabled: false,
      maxLength: 1024,
      readonly: false,
      viewable: false,
      visible: true,
    };
    field.selectInfo = null;
    field.autoCompleteType = "off";
    field.checked = false;
    field.elementNumber = 0;
    field.html = {
      className: "input-block",
      id: "password",
      name: "password",
      placeholder: "Inter Password",
      type: "password",
    };

    const fieldElement = createFormFieldHelper({
      id: field.html.id,
      name: field.html.name,
      class: field.html.className,
      placeholder: field.html.placeholder,
      type: "password",
    });

    formElement.appendChild(fieldElement);

    const pageDetails = autofiller.collect(document);
    expect(pageDetails).toStrictEqual<AutoFillPageDetails>({
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
      fields: [field],
      collectedTimestamp: pageDetails.collectedTimestamp,
    });
  });
});
