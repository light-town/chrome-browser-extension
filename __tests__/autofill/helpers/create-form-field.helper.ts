export default function createFormFieldHelper(
  options: {
    id?: string;
    name?: string;
    title?: string;
    class?: string;
    placeholder?: string;
    type?: "text" | "password" | "email" | "tel";
  } = {}
): HTMLInputElement {
  const field = document.createElement("input");

  for (const [key, value] of Object.entries(options)) {
    field.setAttribute(key, value);
  }
  return field;
}
