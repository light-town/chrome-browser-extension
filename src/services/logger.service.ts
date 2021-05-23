import { injectable } from "inversify";

@injectable()
export default class LoggerService {
  log(namespace: string, action: string, ...args: any[]) {
    console.log(`[${namespace}] ${action}`, ...args);
  }
}
