import {
  applyOptions,
  DiscordenoMessage,
  NaticoSubCommand,
  NaticoSubCommandOptions,
} from "../../../deps.ts";

//@deno-fmt-ignore
@applyOptions<NaticoSubCommandOptions>({
  id: "saychannel",
  name: "channel",
  subOf: "say",
  options: [
    {
      type: 3,
      name: "text",
      description: "stuff you want to say in the channel",
      required: false,
    },
  ],
})
export default class channel extends NaticoSubCommand {
  exec(message: DiscordenoMessage, a: { text: string }) {
    message.channel!.send(a.text || "nothing");
  }
}
