import { NaticoModule, NaticoModuleOptions } from "../NaticoModule.ts";
import { NaticoListenerHandler } from "./ListenerHandler.ts";
import { EventHandlers } from "../../../discordeno_deps.ts";
import { NaticoClient } from "../NaticoClient.ts";

export interface NaticoListenerOptions<T = any> extends NaticoModuleOptions {
  event: T;
  emitter: string;
}

export type NaticoListenerOptionsDiscordenoEvents = NaticoListenerOptions<keyof EventHandlers>;

export abstract class NaticoListener extends NaticoModule {
  declare handler: NaticoListenerHandler<NaticoClient>;
  event!: string;
  emitter!: string;
}
