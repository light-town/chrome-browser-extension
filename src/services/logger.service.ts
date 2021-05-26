import { injectable } from "inversify";

@injectable()
export default class LoggerService {
  public log(namespace: string, action: string, ...args: any[]) {
    this.make("LOG", namespace, action, ...args);
  }

  public error(namespace: string, action: string, ...args: any[]) {
    this.make("ERROR", namespace, action, ...args);
  }

  private make(
    type: string,
    namespace: string,
    action: string,
    ...args: any[]
  ) {
    console.log(`[${type}] [${namespace}] ${action}`, ...args);
  }
}
