import { applyOptions, DiscordenoMessage, NaticoCommand, NaticoCommandOptions } from "../../deps.ts";

//@deno-fmt-ignore
@applyOptions<NaticoCommandOptions>({
  id: "ping",
  name: "ping",
  aliases: ["ping"],
})
export default class ping extends NaticoCommand {
  exec(message: DiscordenoMessage) {
    message.reply("Pong");
  }
}
