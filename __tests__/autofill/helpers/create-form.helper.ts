export default function createFormHelper(
  options: {
    id?: string;
    name?: string;
    action?: string;
    method?: string;
    class?: string;
  } = {}
): HTMLFormElement {
  const form = document.createElement("form");

  for (const [key, value] of Object.entries(options)) {
    form.setAttribute(key, value);
  }
  return form;
}
