import { NaticoTaskHandler } from "./TaskHandler.ts";
import { NaticoModule, NaticoModuleOptions } from "../NaticoModule.ts";
import { NaticoClient } from "../NaticoClient.ts";

export interface NaticoTaskOptions extends NaticoModuleOptions {
  delay: number | delayFN;
  runOnStart?: boolean;
}

export abstract class NaticoTask extends NaticoModule {
  declare handler: NaticoTaskHandler;
  delay?: number | delayFN;
  runOnStart?: boolean;
}
export type delayFN = (client: NaticoClient) => number;
