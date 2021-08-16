import { NaticoModule, NaticoModuleOptions } from "../NaticoModule.ts";
import { NaticoListenerHandler } from "./ListenerHandler.ts";

export interface NaticoListenerOptions extends NaticoModuleOptions {
  event: string;
  emitter: string;
}

export abstract class NaticoListener extends NaticoModule {
  declare handler: NaticoListenerHandler;
  event!: string;
  emitter!: string;
}
