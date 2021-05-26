export default async function setIconHelper(suffix: "" | "locked" = "") {
  return new Promise<void>((resolve) => {
    const suff = suffix === "" ? suffix : `-${suffix}`;

    chrome.browserAction.setIcon(
      {
        path: {
          16: "/assets/logo/x16" + suff + ".png",
          20: "/assets/logo/x20" + suff + ".png",
          32: "/assets/logo/x32" + suff + ".png",
        },
      },
      () => resolve()
    );
  });
}
