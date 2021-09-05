import {
  applyOptions,
  NaticoListener,
  NaticoListenerOptions,
} from "../../deps.ts";

//@deno-fmt-ignore
@applyOptions<NaticoListenerOptions>({
  id:"ready",
  emitter: "client",
  event: "ready",
})
export default class ready extends NaticoListener {
  exec() {
    //@ts-ignore - extend the class to make types work for this
    console.log(`Bot has started with id ${this.client.id}`);
  }
}
