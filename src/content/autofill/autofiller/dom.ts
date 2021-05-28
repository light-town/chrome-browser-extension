import { injectable } from "inversify";

@injectable()
export default class DOM {
  public query<T extends Element>(doc: Document, query: string): T[] {
    try {
      return Array.prototype.slice.call(doc.querySelectorAll(query)) as T[];
    } catch (e) {
      return [];
    }
  }

  public getElementAttrValue<T extends Element>(
    el: T,
    attrName: string
  ): string | null {
    let attrVal = el[attrName];

    if (typeof attrVal === "string") return attrVal;

    attrVal = el.getAttribute(attrName);

    return typeof attrVal === "string" ? attrVal : null;
  }

  public getLabelTag<T extends HTMLInputElement>(document: Document, el: T) {
    let docLabel;
    let theLabels = [];

    if (el.labels && el.labels.length && 0 < el.labels.length) {
      theLabels = Array.prototype.slice.call(el.labels);
    } else {
      if (el.id) {
        theLabels = theLabels.concat(
          Array.prototype.slice.call(
            this.query(document, "label[for=" + JSON.stringify(el.id) + "]")
          )
        );
      }

      if (el.name) {
        docLabel = this.query(
          document,
          "label[for=" + JSON.stringify(el.name) + "]"
        );

        for (var labelIndex = 0; labelIndex < docLabel.length; labelIndex++) {
          if (-1 === theLabels.indexOf(docLabel[labelIndex])) {
            theLabels.push(docLabel[labelIndex]);
          }
        }
      }

      for (
        var theEl: Node & ParentNode = el;
        theEl && theEl != document;
        theEl = theEl.parentNode
      ) {
        if (
          "label" === (theEl as HTMLLabelElement)?.tagName?.toLowerCase() &&
          -1 === theLabels.indexOf(theEl)
        ) {
          theLabels.push(theEl);
        }
      }
    }

    if (0 === theLabels.length) {
      const theEl = el.parentNode as HTMLLabelElement;
      if (
        "dd" === theEl?.tagName.toLowerCase() &&
        null !== theEl?.previousElementSibling &&
        "dt" === theEl?.previousElementSibling.tagName.toLowerCase()
      ) {
        theLabels.push(theEl?.previousElementSibling);
      }
    }

    if (0 > theLabels.length) {
      return null;
    }

    return theLabels
      .map(function(l) {
        return (l.textContent || l.innerText)
          .replace(/^\\s+/, "")
          .replace(/\\s+$/, "")
          .replace("\\n", "")
          .replace(/\\s{2,}/, " ");
      })
      .join("");
  }

  public getLabelTop<T extends unknown>(el: T) {
    let parent: Node & ParentNode;
    for (
      let node = (el as Element).parentElement || (el as Element).parentNode;
      node && "td" !== (node as HTMLLabelElement)?.tagName?.toLowerCase();

    ) {
      parent = (el as Element).parentElement || (el as Element).parentNode;
    }
    if (!parent) return null;

    if ("tr" !== (parent as HTMLLabelElement).tagName.toLowerCase()) {
      return null;
    }

    parent = (parent as HTMLLabelElement).previousElementSibling;
    if (
      !parent ||
      "tr" !== ((parent as HTMLLabelElement).tagName + "").toLowerCase() ||
      ((parent as HTMLTableRowElement).cells &&
        (el as HTMLTableCellElement).cellIndex >=
          (parent as HTMLTableRowElement).cells.length)
    ) {
      return null;
    }

    const nel = (parent as HTMLTableRowElement).cells[
      (el as HTMLTableCellElement).cellIndex
    ];
    var elText = nel.textContent || nel.innerText;
    return (elText = this.cleanText(elText));
  }

  public cleanText(s) {
    var sVal = null;
    s &&
      ((sVal = s.replace(/^\\s+|\\s+$|\\r?\\n.*$/gm, "")),
      (sVal = 0 < sVal.length ? sVal : null));
    return sVal;
  }

  public isKnownTag<T extends Element>(el: T) {
    if (!el) return;

    const tags = "select option input form textarea button table iframe body head script".split(
      " "
    );

    const elTag = el ? (el.tagName || "").toLowerCase() : "";

    return tags.indexOf(elTag) !== -1;
  }

  public checkNodeType(arr, el) {
    var theText = "";
    3 === el.nodeType
      ? (theText = el.nodeValue)
      : 1 === el.nodeType && (theText = el.textContent || el.innerText);
    (theText = this.cleanText(theText)) && arr.push(theText);
  }

  public shiftForLeftLabel<T extends Element>(
    el: T,
    arr: any[],
    steps?: number
  ) {
    var sib;
    for (
      steps || (steps = 0);
      el && el.previousSibling;
      el = <T>el.previousSibling
    ) {
      if (this.isKnownTag(el)) {
        return;
      }

      this.checkNodeType(arr, el);
    }
    if (el && 0 === arr.length) {
      for (sib = null; !sib; ) {
        el = <T>(el.parentElement || el.parentNode);
        if (!el) {
          return;
        }
        for (
          sib = el.previousSibling;
          sib && !this.isKnownTag(sib) && sib.lastChild;

        ) {
          sib = sib.lastChild;
        }
      }

      // base case and recurse
      this.isKnownTag(sib) ||
        (this.checkNodeType(arr, sib),
        0 === arr.length && this.shiftForLeftLabel(sib, arr, steps + 1));
    }
  }

  public getElementValue(el) {
    switch (el.type?.toLowerCase()) {
      case "checkbox":
        return el.checked ? "✓" : "";
      case "hidden":
        el = el.value;
        if (!el || "number" != typeof el.length) {
          return "";
        }
        254 < el.length && (el = el.substr(0, 254) + "...SNIPPED");
        return el;
      default:
        return el.value;
    }
  }

  public getSelectElementOptions(el) {
    if (!el.options) {
      return null;
    }

    var options = Array.prototype.slice.call(el.options).map(function(option) {
      var optionText = option.text
        ? option.text
            ?.toLowerCase()
            .replace(/\\s/gm, "")
            .replace(/[~`!@$%^&*()\\-_+=:;'\"\\[\\]|\\\\,<.>\\?]/gm, "")
        : null;

      return [optionText ? optionText : null, option.value];
    });

    return {
      options: options,
    };
  }

  // is a dom element visible on screen?
  public isElementVisible(el) {
    var theEl = el;
    el = (el = el.ownerDocument) ? el.defaultView : {};

    // walk the dom tree
    for (var elStyle; theEl && theEl !== document; ) {
      elStyle = el.getComputedStyle
        ? el.getComputedStyle(theEl, null)
        : theEl.style;
      if (!elStyle) {
        return true;
      }

      if ("none" === elStyle.display || "hidden" == elStyle.visibility) {
        return false;
      }

      // walk up
      theEl = theEl.parentNode;
    }

    return theEl === document;
  }

  // is a dom element "viewable" on screen?
  public isElementViewable(el) {
    var theDoc = el.ownerDocument.documentElement,
      rect = el.getBoundingClientRect(),
      docScrollWidth = theDoc.scrollWidth,
      docScrollHeight = theDoc.scrollHeight,
      leftOffset = rect.left - theDoc.clientLeft,
      topOffset = rect.top - theDoc.clientTop,
      theRect;

    if (
      !this.isElementVisible(el) ||
      !el.offsetParent ||
      10 > el.clientWidth ||
      10 > el.clientHeight
    ) {
      return false;
    }

    var rects = el.getClientRects();
    if (0 === rects.length) {
      return false;
    }

    for (var i = 0; i < rects.length; i++) {
      if (
        ((theRect = rects[i]),
        theRect.left > docScrollWidth || 0 > theRect.right)
      ) {
        return false;
      }
    }

    if (
      0 > leftOffset ||
      leftOffset > docScrollWidth ||
      0 > topOffset ||
      topOffset > docScrollHeight
    ) {
      return false;
    }

    // walk the tree
    for (
      var pointEl = el.ownerDocument.elementFromPoint(
        leftOffset +
          (rect.right > window.innerWidth
            ? (window.innerWidth - leftOffset) / 2
            : rect.width / 2),
        topOffset +
          (rect.bottom > window.innerHeight
            ? (window.innerHeight - topOffset) / 2
            : rect.height / 2)
      );
      pointEl && pointEl !== el && pointEl !== document;

    ) {
      if (
        pointEl.tagName &&
        "string" === typeof pointEl.tagName &&
        "label" === pointEl.tagName.toLowerCase() &&
        el.labels &&
        0 < el.labels.length
      ) {
        return 0 <= Array.prototype.slice.call(el.labels).indexOf(pointEl);
      }

      // walk up
      pointEl = pointEl.parentNode;
    }

    return pointEl === el;
  }
}
