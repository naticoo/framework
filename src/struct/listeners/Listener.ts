import { NaticoModule } from "../NaticoModule.js";
import { NaticoListenerHandler } from "./ListenerHandler.ts";
export abstract class NaticoListener extends NaticoModule {
  declare handler: NaticoListenerHandler;
  event: string;
  emitter: string;
  constructor(id: string, { event, emitter }: { event: string; emitter: string }) {
    super(id);
    this.emitter = emitter;
    this.event = event;
  }
  abstract exec(...args: any[]): unknown | Promise<unknown>;
}
