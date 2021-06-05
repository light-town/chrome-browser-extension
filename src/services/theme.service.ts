export type Schema = "light" | "dark";
export type ListenerFunc = (shema: Schema) => void;

export default class ThemeService {
  private readonly onPreferredColorSchemeChanged: Set<ListenerFunc> = new Set<
    ListenerFunc
  >();

  public constructor() {
    if (window.matchMedia) {
      const colorSchemeQuery = window.matchMedia(
        "(prefers-color-scheme: dark)"
      );

      colorSchemeQuery.addEventListener("change", () =>
        this.onPreferredColorSchemeChanged.forEach((listener) => {
          listener(ThemeService.getPreferredColorScheme());
        })
      );
    }
  }

  public static getPreferredColorScheme(): Schema {
    if (window.matchMedia) {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      } else {
        return "light";
      }
    }
    return "light";
  }
}
