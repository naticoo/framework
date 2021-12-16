import { NaticoTaskHandler } from "./TaskHandler.ts";
import { NaticoModule, NaticoModuleOptions } from "../NaticoModule.ts";
import { NaticoClient } from "../NaticoClient.ts";

export interface NaticoTaskOptions extends NaticoModuleOptions {
  delay: number | delayFN;
  runOnStart?: boolean;
}

export abstract class NaticoTask<T extends NaticoClient> extends NaticoModule {
  declare handler: NaticoTaskHandler<T>;
  delay?: number | delayFN;
  runOnStart?: boolean;
}
export type delayFN = <T extends NaticoClient>(client: T) => number;
