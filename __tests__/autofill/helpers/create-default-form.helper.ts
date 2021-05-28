import { AutoFillForm } from "~/content/autofill/autofiller/interfaces";
import createFormHelper from "./create-form.helper";

export default function createDefaultForm(): [AutoFillForm, HTMLFormElement] {
  const form = new AutoFillForm();
  form.uuid = "__form_0__";
  form.html.id = "index_login_form";
  form.html.name = "login";
  form.html.method = "post";
  form.html.action = "https://localhost/";

  const formElement = createFormHelper({
    id: form.html.id,
    name: form.html.name,
    method: form.html.method,
    action: form.html.action,
  });

  return [form, formElement];
}
