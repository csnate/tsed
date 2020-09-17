import {Injectable, ProviderScope} from "@tsed/di";
import {createContext} from "../utils/createContext";
import {createFakeRawDriver} from "./FakeRawDriver";
import {PlatformHandler} from "./PlatformHandler";
import {PlatformRouter} from "./PlatformRouter";

declare global {
  namespace TsED {
    // @ts-ignore
    export interface Application {}
  }
}

/**
 * `PlatformApplication` is used to provide all routes collected by annotation `@Controller`.
 *
 * @platform
 */
@Injectable({
  scope: ProviderScope.SINGLETON
})
export class PlatformApplication<App = TsED.Application, Router = TsED.Router> extends PlatformRouter<Router> {
  raw: App;
  rawApp: App;
  rawRouter: Router;

  constructor(platformHandler: PlatformHandler) {
    super(platformHandler);
    this.rawApp = this.raw = PlatformApplication.createRawApp() as any;
  }

  protected static createRawApp(): any {
    return createFakeRawDriver();
  }

  getApp(): App {
    return this.raw;
  }

  useContext(): this {
    // @ts-ignore
    this.getApp().use(async (req: any, res: any, next: any) => {
      await createContext(this.injector, req, res);
      next();
    });

    return this;
  }
}
