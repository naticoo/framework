import {
  applyOptions,
  ConvertedOptions,
  DiscordenoMessage,
  NaticoCommand,
  NaticoListener,
  NaticoListenerOptions,
} from "../../deps.ts";

//@deno-fmt-ignore
@applyOptions<NaticoListenerOptions>({
  id: "commandStarted",
  emitter: "commandHandler",
  event: "commandStarted",
})
export default class commandStarted extends NaticoListener {
  exec(
    message: DiscordenoMessage,
    command: NaticoCommand,
    args: ConvertedOptions,
  ) {
    console.log("command:", command.id, "started with args", args);
  }
}
