import { inject, injectable } from "inversify";
import DOM from "./dom";
import {
  AutoFillAction,
  AutoFillActionTypesEnum,
  AutoFillField,
  AutoFillForm,
  AutoFillPageDetails,
  AutoFillScript,
  AutoFillSelector,
  AutoFillSelectorTypesEnum,
} from "./interfaces";

export const MAX_FIELD_VALUE_LENGTH = 1024;
export const LIMIT_GETTING_FORM_FIELDS = 48;
export const AUTO_FILLER_FORM_FIELDS = "__auto_filler_form_fields__";

export class ExtendedDocument extends Document {
  [AUTO_FILLER_FORM_FIELDS]: Set<HTMLInputElement>;
}

@injectable()
export default class AutoFiller {
  public constructor(@inject(DOM) private readonly dom: DOM) {
    (document as ExtendedDocument)[AUTO_FILLER_FORM_FIELDS] = new Set();
  }

  public collect(document: Document): AutoFillPageDetails {
    return this.getPageDetails(document as ExtendedDocument);
  }

  private getPageDetails(document: ExtendedDocument): AutoFillPageDetails {
    const view = document.defaultView ? document.defaultView : window;

    const forms: AutoFillForm[] = this.dom
      .query<HTMLFormElement>(document, "form")
      .map((el, index) => {
        const form = new AutoFillForm();
        el.uuid = `__form_${index}__`;
        form.uuid = `__form_${index}__`;

        const htmlAttrs = [
          ["id", this.dom.getElementAttrValue(el, "id")],
          ["name", this.dom.getElementAttrValue(el, "name")],
          ["action", this.dom.getElementAttrValue(el, "action")],
          ["method", this.dom.getElementAttrValue(el, "method")],
        ];

        for (const [key, value] of htmlAttrs) {
          if (!value.length) continue;

          form.html[key] = value;
        }

        return form;
      });

    const fields = this.getFormFields(document, LIMIT_GETTING_FORM_FIELDS).map(
      (el, index) => {
        const fieldMaxLength =
          typeof el.maxLength === "number" && isNaN(el.maxLength)
            ? el.maxLength
            : MAX_FIELD_VALUE_LENGTH;

        const fieldTabIndex = Number.isNaN(
          Number.parseInt(this.dom.getElementAttrValue(el, "tabindex"))
        )
          ? undefined
          : Number.parseInt(this.dom.getElementAttrValue(el, "tabindex"));

        const field = new AutoFillField();
        field.uuid = `__field_${index}__`;
        // @ts-ignore
        el.uuid = `__field_${index}__`;

        const htmlAttrs = [
          ["id", this.dom.getElementAttrValue(el, "id")],
          ["name", this.dom.getElementAttrValue(el, "name")],
          ["className", this.dom.getElementAttrValue(el, "class")],
          ["title", this.dom.getElementAttrValue(el, "title")],
          ["tabindex", fieldTabIndex],
          ["placeholder", this.dom.getElementAttrValue(el, "placeholder")],
          ["rel", this.dom.getElementAttrValue(el, "rel")],
          ["type", this.dom.getElementAttrValue(el, "type")],
        ];

        for (const [key, value] of htmlAttrs) {
          if (
            !value ||
            (typeof value === "string" && !value.length) ||
            (typeof value === "number" && Number.isNaN(value))
          )
            continue;

          field.html[key] = value;
        }

        field.properties = {
          maxLength: Math.min(fieldMaxLength, MAX_FIELD_VALUE_LENGTH),
        };

        document[AUTO_FILLER_FORM_FIELDS][field.uuid] = el;

        /* if (el?.type?.toLowerCase() !== "hidden") {
          field.labels = {
            tag: this.dom.getLabelTag(document, el),
            data: this.dom.getElementAttrValue(el, "data-label"),
            aria: this.dom.getElementAttrValue(el, "aria-label"),
            top: this.dom.getLabelTop(el),
          };

          let labelArr: any[] = [];
          for (
            let sib: Element | ChildNode = el;
            sib && sib.nextSibling;
            sib = sib.nextSibling
          ) {
            if (this.dom.isKnownTag(<Element>sib)) break;

            this.dom.checkNodeType(labelArr, sib);
          }

          field.labels.right = labelArr.join("");

          labelArr = [];
          this.dom.shiftForLeftLabel(el, labelArr);

          field.labels.left = labelArr.reverse().join("");
        } */
        field.elementNumber = index;
        field.properties.visible = this.dom.isElementVisible(el);
        field.properties.viewable = this.dom.isElementViewable(el);

        field.value = this.dom.getElementValue(el);
        field.checked = el.checked ?? false;
        field.autoCompleteType =
          <"off" | "on" | "current-password">(
            (el.getAttribute("x-autocompletetype") ||
              el.getAttribute("autocompletetype") ||
              el.getAttribute("autocomplete"))
          ) ?? "off";
        field.properties.disabled = el.disabled;
        field.properties.readonly = el.readOnly;
        field.selectInfo = this.dom.getSelectElementOptions(el);

        if (el.form) field.form = this.dom.getElementAttrValue(el.form, "uuid");

        return field;
      }
    );

    const pageDetails: AutoFillPageDetails = {
      document: {
        uuid: "__document_0__",
        title: document.title,
        url: document.location.href,
      },
      tab: {
        url: view.location.href,
      },
      page: {
        url: view.location.href,
        title: document.title,
      },
      forms: forms.reduce((prev, f) => ({ ...prev, [f.uuid]: f }), {}),
      fields,
      collectedTimestamp: new Date().getTime(),
    };

    return pageDetails;
  }

  private doSelect<T extends Element>(
    document: Document,
    selector: AutoFillSelector
  ): T[] {
    switch (selector.type) {
      case AutoFillSelectorTypesEnum.UUID: {
        const field: T = document[AUTO_FILLER_FORM_FIELDS][selector.value];
        return [field];
      }
      case AutoFillSelectorTypesEnum.QUERY: {
        return this.dom.query(document, selector.value);
      }
      default: {
        return [];
      }
    }
  }

  private doAction(document: Document, action: AutoFillAction): void {
    const fields = this.doSelect<HTMLInputElement>(document, action.selector);

    function normalizeEvent(el, eventName) {
      var ev;
      /* if (isFirefox) {
        ev = document.createEvent("KeyboardEvent");
        ev.initKeyEvent(
          eventName,
          true,
          false,
          null,
          false,
          false,
          false,
          false,
          0,
          0
        );
      } else { */
      ev = el.ownerDocument.createEvent("Events");
      ev.initEvent(eventName, true, false);
      ev.charCode = 0;
      ev.keyCode = 0;
      ev.which = 0;
      // ev.srcElement = el;
      // ev.target = el;
      /*   } */

      return ev;
    }

    function setValueForElement(el) {
      var valueToSet = el.value;
      clickElement(el);
      doFocusElement(el, false);
      el.dispatchEvent(normalizeEvent(el, "keydown"));
      el.dispatchEvent(normalizeEvent(el, "keypress"));
      el.dispatchEvent(normalizeEvent(el, "keyup"));
      el.value !== valueToSet && (el.value = valueToSet);
    }

    function doFocusElement(el, setValue) {
      if (setValue) {
        var existingValue = el.value;
        el.focus();
        el.value !== existingValue && (el.value = existingValue);
      } else {
        el.focus();
      }
    }

    function clickElement(el) {
      if (!el || (el && "function" !== typeof el.click)) {
        return false;
      }
      el.click();
      return true;
    }

    function setValueForElementByEvent(el) {
      var valueToSet = el.value,
        ev1 = el.ownerDocument.createEvent("HTMLEvents"),
        ev2 = el.ownerDocument.createEvent("HTMLEvents");

      el.dispatchEvent(normalizeEvent(el, "keydown"));
      el.dispatchEvent(normalizeEvent(el, "keypress"));
      el.dispatchEvent(normalizeEvent(el, "keyup"));
      ev2.initEvent("input", true, true);
      el.dispatchEvent(ev2);
      ev1.initEvent("change", true, true);
      el.dispatchEvent(ev1);
      el.blur();
      el.value !== valueToSet && (el.value = valueToSet);
    }

    function doAllFillOperations(el, afterValSetFunc) {
      setValueForElement(el);
      afterValSetFunc(el);
      setValueForElementByEvent(el);
    }

    switch (action.type) {
      case AutoFillActionTypesEnum.FILL: {
        for (const field of fields) {
          if (!field || field.disabled || field.readOnly) return;

          switch (
            (field.form && !field.form.opfilled,
            field.type ? field.type.toLowerCase() : null)
          ) {
            default:
              field.value == action.value;

              doAllFillOperations(field, function(f) {
                f.value = action.value;
              });
          }

          field.form.opfilled = true;
        }
        break;
      }
    }
  }

  private getFormFields(document: Document, limit: number): HTMLInputElement[] {
    const fieldElements: HTMLInputElement[] = this.dom.query<HTMLInputElement>(
      document,
      `input:not([type="hidden"]):not([type="submit"]):not([type="reset"]):not([type="button"]):not([type="image"]):not([type="file"]), select`
    );

    if (fieldElements.length <= limit) {
      return fieldElements;
    }

    let formFields = [];
    const unimportantFormField = [];

    for (const field of fieldElements) {
      if (formFields.length >= limit) break;

      const type = field?.type?.toLowerCase();
      if (type === "checkbox" || type === "radio") {
        unimportantFormField.push(field);
      } else {
        formFields.push(field);
      }
    }

    const unimportantFormFieldsToAdd = limit - formFields.length;
    if (unimportantFormFieldsToAdd > 0) {
      formFields = formFields.concat(
        unimportantFormField.slice(0, unimportantFormFieldsToAdd)
      );
    }

    return formFields;
  }

  public fill(document: Document, fillScript: AutoFillScript): void {
    for (const action of fillScript.actions) {
      this.doAction(document, action);
    }
  }
}
