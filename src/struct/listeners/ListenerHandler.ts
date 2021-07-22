import { NaticoClient } from "../NaticoClient.ts";
import { NaticoHandler } from "../NaticoHandler.js";
import { NaticoListener } from "./Listener.ts";
import { Collection } from "../../../deps.ts";
import { ListenerHandlerEvents } from "../../util/Constants.ts";
export class NaticoListenerHandler extends NaticoHandler {
  declare modules: Collection<string, NaticoListener>;
  emitters: Collection<string, any>;
  directory: string;

  constructor(client: NaticoClient, { directory }: { directory: string }) {
    super(client, {
      directory,
    });
    this.directory = directory;
    this.modules = new Collection();
    this.emitters = new Collection();
    this.emitters.set("client", this.client);
  }

  register(listener: NaticoListener, filepath: string) {
    super.register(listener, filepath);
    listener.exec = listener.exec.bind(listener);
    this.addToEmitter(listener.id);
    return listener;
  }

  addToEmitter(id: string) {
    const listener = this.modules.get(id.toString());
    if (!listener) return;

    const emitter = this.emitters.get(listener.emitter);
    if (emitter == this.client) this.client.addEvent(listener.event);
    emitter.on(listener.event, async (...args: any[]) => {
      try {
        await listener.exec(...args);
      } catch (e) {
        this.emit(ListenerHandlerEvents.LISTENERERROR, e, listener);
      }
    });
    return listener;
  }
  setEmitters(emitters: any) {
    for (const [key, value] of Object.entries(emitters)) {
      this.emitters.set(key, value);
    }

    return this;
  }
}
