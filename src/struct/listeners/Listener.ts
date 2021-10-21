import { NaticoModule, NaticoModuleOptions } from "../NaticoModule.ts";
import { NaticoListenerHandler } from "./ListenerHandler.ts";
import { EventHandlersDefinitions } from "../../../discordeno_deps.ts";

export interface NaticoListenerOptions<T = any> extends NaticoModuleOptions {
  event: T;
  emitter: string;
}

export type NaticoListenerOptionsDiscordenoEvents = NaticoListenerOptions<keyof EventHandlersDefinitions>;

export abstract class NaticoListener extends NaticoModule {
  declare handler: NaticoListenerHandler;
  event!: string;
  emitter!: string;
}
