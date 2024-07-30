import {Store, useDecorators} from "@tsed/core";
import {Define} from "./define.js";
import {PulseStore, EveryOptions} from "../interfaces/PulseStore";

export function Every(interval: string, options: EveryOptions = {}): MethodDecorator {
  return useDecorators(Define(options), (target: any, propertyKey: string) => {
    const store: PulseStore = {
      every: {
        [propertyKey]: {...options, interval}
      }
    };
    Store.from(target).merge("pulse", store);
  });
}