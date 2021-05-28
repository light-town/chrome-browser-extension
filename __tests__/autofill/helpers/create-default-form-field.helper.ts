import {
  AUTO_FILLER_FORM_FIELDS,
  MAX_FIELD_VALUE_LENGTH,
} from "~/content/autofill/autofiller";
import { AutoFillField } from "~/content/autofill/autofiller/interfaces";
import createFormFieldHelper from "./create-form-field.helper";

export default function createDefaultFormField(
  options: AutoFillField
): [AutoFillField, HTMLInputElement] {
  const field = new AutoFillField();
  field.uuid = options?.uuid;
  field.form = options?.form;
  field.value = options?.value ?? "";
  field.properties = {
    disabled: options?.properties?.disabled ?? false,
    maxLength: options?.properties?.maxLength ?? MAX_FIELD_VALUE_LENGTH,
    readonly: options?.properties?.readonly ?? false,
    viewable: options?.properties?.viewable ?? false,
    visible: options?.properties?.visible ?? true,
  };
  field.selectInfo = options?.selectInfo ?? null;
  field.autoCompleteType = options?.autoCompleteType ?? "off";
  field.checked = options?.checked ?? false;
  field.elementNumber = options?.elementNumber;
  field.html = {
    id: options?.html?.id ?? "",
    name: options?.html?.name ?? "",
    placeholder: options?.html?.placeholder ?? "",
    className: options?.html?.className ?? "",
    type: options?.html?.type ?? "text",
  };

  const fieldElement = createFormFieldHelper({
    id: field.html.id,
    name: field.html.name,
    class: field.html.className,
    placeholder: field.html.placeholder,
    type: field.html.type,
  });

  document[AUTO_FILLER_FORM_FIELDS][field.uuid] = fieldElement;

  return [field, fieldElement];
}
