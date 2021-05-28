import { injectable } from "inversify";
import { FillAutoFillAction } from "~/content/autofill/autofiller/actions";
import {
  AutoFillField,
  AutoFillPageDetails,
  AutoFillScript,
} from "~/content/autofill/autofiller/interfaces";
import { UuidAutoFillSelector } from "~/content/autofill/autofiller/selector";

export class ItemField {
  id: string;
  fieldName: string;
  name: string;
  value: string;
  position: number;
}

const UsernameFieldNames: string[] = [
  // English
  "username",
  "user name",
  "email",
  "email address",
  "e-mail",
  "e-mail address",
  "userid",
  "user id",
  "customer id",
  "login id",
  // German
  "benutzername",
  "benutzer name",
  "email adresse",
  "e-mail adresse",
  "benutzerid",
  "benutzer id",
];

@injectable()
export default class AutoFillService {
  public fill(
    pageDetails: AutoFillPageDetails,
    itemFields: ItemField[]
  ): AutoFillScript {
    const fillScript = new AutoFillScript(pageDetails.document.uuid);

    const filledFields: { [id: string]: AutoFillField } = {};
    const fieldNames: string[] = [];
    itemFields.forEach((f: ItemField) => {
      fieldNames.push(f?.fieldName?.toLowerCase());
    });

    pageDetails.fields.forEach((field: AutoFillField) => {
      if (filledFields.hasOwnProperty(field.uuid) || !field.properties.viewable)
        return;

      const matchingIndex = this.findMatchingFieldIndex(field, fieldNames);

      if (matchingIndex > -1) {
        let val = itemFields[matchingIndex].value;

        filledFields[field.uuid] = field;
        this.fillByUuid(fillScript, field, val);
      }
    });

    return this.generateLoginFillScript(
      fillScript,
      pageDetails,
      filledFields,
      itemFields
    );
  }

  private fillByUuid(
    fillScript: AutoFillScript,
    field: AutoFillField,
    value: string
  ): void {
    if (
      field.properties.maxLength &&
      value &&
      value.length > field.properties.maxLength
    ) {
      value = value.substr(0, value.length);
    }

    const selector = new UuidAutoFillSelector(field.uuid);

    /* fillScript.actions.push(new ClickAutoFillAction(selector));
    fillScript.actions.push(new FocusAutoFillAction(selector)); */
    fillScript.actions.push(new FillAutoFillAction(selector, value));
  }

  private findMatchingFieldIndex(
    field: AutoFillField,
    names: string[]
  ): number {
    for (let i = 0; i < names.length; i++) {
      /* if (names[i].indexOf("=") > -1) {
        if (this.fieldPropertyIsPrefixMatch(field.html, "id", names[i], "id")) {
          return i;
        }
        if (
          this.fieldPropertyIsPrefixMatch(field.html, "name", names[i], "name")
        ) {
          return i;
        }
        if (
          this.fieldPropertyIsPrefixMatch(
            field.labels,
            "tag",
            names[i],
            "label"
          )
        ) {
          return i;
        }
        if (
          this.fieldPropertyIsPrefixMatch(
            field.labels,
            "aria",
            names[i],
            "label"
          )
        ) {
          return i;
        }
        if (
          this.fieldPropertyIsPrefixMatch(
            field.html,
            "placeholder",
            names[i],
            "placeholder"
          )
        ) {
          return i;
        }
      } */

      if (this.fieldPropertyIsMatch(field.html, "id", names[i])) {
        return i;
      }
      if (this.fieldPropertyIsMatch(field.html, "name", names[i])) {
        return i;
      }
      /* if (this.fieldPropertyIsMatch(field, "type", names[i])) {
        return i;
      } */
      if (this.fieldPropertyIsMatch(field.labels, "tag", names[i])) {
        return i;
      }
      if (this.fieldPropertyIsMatch(field.labels, "aria", names[i])) {
        return i;
      }
      /// ??? usually on different language
      if (this.fieldPropertyIsMatch(field.html, "placeholder", names[i])) {
        return i;
      }
    }

    return -1;
  }

  /* private fieldPropertyIsPrefixMatch(
    field: any,
    property: string,
    name: string,
    prefix: string,
    separator = "="
  ): boolean {
    if (name.indexOf(prefix + separator) === 0) {
      const sepIndex = name.indexOf(separator);
      const val = name.substring(sepIndex + 1);
      return val != null && this.fieldPropertyIsMatch(field, property, val);
    }
    return false;
  } */

  private fieldPropertyIsMatch(
    field: any,
    property: string,
    name: string
  ): boolean {
    let fieldVal = field[property] as string;
    if (!fieldVal) return false;

    fieldVal = fieldVal.trim().replace(/(?:\r\n|\r|\n)/g, "");
    if (name.startsWith("regex=")) {
      try {
        const regexParts = name.split("=", 2);
        if (regexParts.length === 2) {
          const regex = new RegExp(regexParts[1], "i");
          return regex.test(fieldVal);
        }
      } catch (e) {}
    } else if (name.startsWith("csv=")) {
      const csvParts = name.split("=", 2);
      if (csvParts.length === 2) {
        const csvVals = csvParts[1].split(",");
        for (let i = 0; i < csvVals.length; i++) {
          const val = csvVals[i];
          if (
            val != null &&
            val.trim().toLowerCase() === fieldVal.toLowerCase()
          ) {
            return true;
          }
        }
        return false;
      }
    }

    return fieldVal.toLowerCase() === name;
  }

  private generateLoginFillScript(
    fillScript: AutoFillScript,
    pageDetails: AutoFillPageDetails,
    filledFields: { [id: string]: AutoFillField },
    itemFields: ItemField[],
    options: {
      onlyEmptyFields?: boolean;
      fillNewPassword?: boolean;
      onlyVisibleFields?: boolean;
      skipUsernameOnlyFill?: boolean;
    } = {}
  ): AutoFillScript {
    const passwords: AutoFillField[] = [];
    const usernames: AutoFillField[] = [];
    const itemUsername: string = itemFields.find(
      (f) => f.fieldName.toLocaleLowerCase() === "username"
    )?.value;
    const itemPassword: string = itemFields.find(
      (f) => f.fieldName.toLocaleLowerCase() === "password"
    )?.value;

    // const login = options.cipher.login;

    /* if (!itemFields.password || login.password === "") {
      // No password for this login. Maybe they just wanted to auto-fill some custom fields?
      fillScript = this.setFillScriptForFocus(filledFields, fillScript);
      return fillScript;
    } */

    let passwordFields = this.loadPasswordFields(
      pageDetails,
      false,
      false,
      options.onlyEmptyFields,
      options.fillNewPassword
    );

    if (!passwordFields.length && !options.onlyVisibleFields) {
      // not able to find any viewable password fields. maybe there are some "hidden" ones?
      passwordFields = this.loadPasswordFields(
        pageDetails,
        true,
        true,
        options.onlyEmptyFields,
        options.fillNewPassword
      );
    }

    for (const formKey in pageDetails.forms) {
      if (!pageDetails.forms.hasOwnProperty(formKey)) continue;

      passwordFields.forEach((passField) => {
        passwords.push(passField);

        if (itemUsername) {
          let username = this.findUsernameField(
            pageDetails,
            passField,
            false,
            false,
            false
          );

          if (!username && !options.onlyVisibleFields) {
            // not able to find any viewable username fields. maybe there are some "hidden" ones?
            username = this.findUsernameField(
              pageDetails,
              passField,
              true,
              true,
              false
            );
          }

          if (username) usernames.push(username);
        }
      });
    }

    if (passwordFields.length && !passwords.length) {
      // The page does not have any forms with password fields. Use the first password field on the page and the
      // input field just before it as the username.

      const firstPassField = passwordFields[0];
      passwords.push(firstPassField);

      if (itemUsername && firstPassField.elementNumber > 0) {
        let username = this.findUsernameField(
          pageDetails,
          firstPassField,
          false,
          false,
          true
        );

        if (!username && !options.onlyVisibleFields) {
          // not able to find any viewable username fields. maybe there are some "hidden" ones?
          username = this.findUsernameField(
            pageDetails,
            firstPassField,
            true,
            true,
            true
          );
        }

        if (username) {
          usernames.push(username);
        }
      }
    }

    if (!passwordFields.length && !options.skipUsernameOnlyFill) {
      // No password fields on this page. Let's try to just fuzzy fill the username.
      pageDetails.fields.forEach((f: any) => {
        if (
          f.viewable &&
          (f.type === "text" || f.type === "email" || f.type === "tel") &&
          this.fieldIsFuzzyMatch(f, UsernameFieldNames)
        ) {
          usernames.push(f);
        }
      });
    }

    usernames.forEach((username) => {
      if (filledFields.hasOwnProperty(username.uuid)) {
        return;
      }

      filledFields[username.uuid] = username;
      this.fillByUuid(fillScript, username, itemUsername);
    });

    passwords.forEach((p) => {
      if (filledFields.hasOwnProperty(p.uuid)) {
        return;
      }

      filledFields[p.uuid] = p;
      this.fillByUuid(fillScript, p, itemPassword);
    });

    // fillScript = this.setFillScriptForFocus(filledFields, fillScript);
    return fillScript;
  }

  private loadPasswordFields(
    pageDetails: AutoFillPageDetails,
    canBeHidden: boolean,
    canBeReadOnly: boolean,
    mustBeEmpty: boolean,
    fillNewPassword: boolean
  ) {
    const arr: AutoFillField[] = [];
    pageDetails.fields.forEach((f) => {
      const isPassword = f.html.type === "password";
      const valueIsLikePassword = (value: string) => {
        if (value == null) {
          return false;
        }
        // Removes all whitespace, _ and - characters
        const cleanedValue = value.toLowerCase().replace(/[\s_\-]/g, "");

        if (cleanedValue.indexOf("password") < 0) {
          return false;
        }

        const ignoreList = ["onetimepassword", "captcha", "findanything"];
        if (ignoreList.some((i) => cleanedValue.indexOf(i) > -1)) {
          return false;
        }

        return true;
      };
      const isLikePassword = () => {
        if (f.html.type !== "text") {
          return false;
        }
        if (valueIsLikePassword(f.html.id)) {
          return true;
        }
        if (valueIsLikePassword(f.html.name)) {
          return true;
        }
        if (valueIsLikePassword(f.html.placeholder)) {
          return true;
        }
        return false;
      };
      if (
        !f.properties.disabled &&
        (canBeReadOnly || !f.properties.readonly) &&
        (isPassword || isLikePassword()) &&
        (canBeHidden || f.properties.viewable) &&
        (!mustBeEmpty || f.value == null || f.value.trim() === "") &&
        (fillNewPassword || f.autoCompleteType !== "new-password")
      ) {
        arr.push(f);
      }
    });
    return arr;
  }

  private findUsernameField(
    pageDetails: AutoFillPageDetails,
    passwordField: AutoFillField,
    canBeHidden: boolean,
    canBeReadOnly: boolean,
    withoutForm: boolean
  ) {
    let usernameField: AutoFillField = null;

    for (const field of pageDetails.fields) {
      if (field.elementNumber >= passwordField.elementNumber) break;

      if (
        !field.properties.disabled &&
        (canBeReadOnly || !field.properties.readonly) &&
        (withoutForm || field.form === passwordField.form) &&
        (canBeHidden || field.properties.viewable) &&
        ["text", "email", "tel"].includes(field.html.type)
      ) {
        usernameField = field;

        if (this.findMatchingFieldIndex(field, UsernameFieldNames) > -1) {
          // We found an exact match. No need to keep looking.

          break;
        }
      }
    }

    return usernameField;
  }

  private fieldIsFuzzyMatch(field: AutoFillField, names: string[]): boolean {
    if (field.html.id && this.fuzzyMatch(names, field.html.id)) {
      return true;
    }
    if (field.html.name && this.fuzzyMatch(names, field.html.name)) {
      return true;
    }
    if (field.labels.tag && this.fuzzyMatch(names, field.labels.tag)) {
      return true;
    }
    if (
      field.html.placeholder &&
      this.fuzzyMatch(names, field.html.placeholder)
    ) {
      return true;
    }
    if (field.labels.left && this.fuzzyMatch(names, field.labels.left)) {
      return true;
    }
    if (field.labels.top && this.fuzzyMatch(names, field.labels.top)) {
      return true;
    }
    if (field.labels.aria && this.fuzzyMatch(names, field.labels.aria)) {
      return true;
    }

    return false;
  }

  private fuzzyMatch(options: string[], value: string): boolean {
    if (
      options == null ||
      options.length === 0 ||
      value == null ||
      value === ""
    ) {
      return false;
    }

    value = value
      .replace(/(?:\r\n|\r|\n)/g, "")
      .trim()
      .toLowerCase();

    for (let i = 0; i < options.length; i++) {
      if (value.indexOf(options[i]) > -1) {
        return true;
      }
    }

    return false;
  }
}
