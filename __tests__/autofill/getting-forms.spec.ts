/**
 * @jest-environment jsdom
 */

import "reflect-metadata";
import AutoFiller from "~/content/autofill/autofiller";
import DOM from "~/content/autofill/autofiller/dom";
import {
  AutoFillForm,
  AutoFillPageDetails,
} from "~/content/autofill/autofiller/interfaces";
import container from "~/services/container";
import createFormHelper from "./helpers/create-form.helper";

export const DEFAULT_URL = "http://localhost/";

describe("[Getting Forms] ...", () => {
  it("should return collected data of forms", () => {
    container.bind<AutoFiller>(AutoFiller).toSelf();
    container.bind<DOM>(DOM).toSelf();

    const autofiller = container.get<AutoFiller>(AutoFiller);

    const form = new AutoFillForm();
    form.uuid = "__form_0__";
    form.html.id = "index_login_form";
    form.html.name = "login";
    form.html.method = "post";
    form.html.action =
      "https://passport.yandex.ru/auth?retpath=https%3A%2F%2Fpassport.yandex.ru%2Fprofile";

    const formElement = createFormHelper({
      id: form.html.id,
      name: form.html.name,
      method: form.html.method,
      action: form.html.action,
    });

    document.body.appendChild(formElement);

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
      fields: [],
      collectedTimestamp: pageDetails.collectedTimestamp,
    });
  });
});
