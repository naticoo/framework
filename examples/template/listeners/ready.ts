import { applyOptions, NaticoListener, NaticoListenerOptions } from "../../deps.ts";

//@deno-fmt-ignore
@applyOptions<NaticoListenerOptions>({
  id: "ready",
  emitter: "client",
  event: "ready",
})
export default class ready extends NaticoListener {
  async exec() {
    console.log(`Bot has started with id ${this.client.applicationId}`);
    //@ts-ignore -
    await this.client.commandHandler.enableSlash();
  }
}
