export class Options {
  fromTab?: boolean;
}

export default function sendMessage<T = any>(
  type: string,
  data: Record<string, any> = {},
  options: Options = {}
): Promise<T> {
  return new Promise(function(resolve) {
    if (options.fromTab)
      chrome.runtime.sendMessage(
        chrome.runtime.id,
        {
          type,
          data,
        },
        (response) => resolve(response)
      );
    else
      chrome.runtime.sendMessage(
        {
          type,
          data,
        },
        (response) => resolve(response)
      );
  });
}
