import {
  applyOptions,
  DiscordenoMessage,
  NaticoSubCommand,
  NaticoSubCommandOptions,
} from "../../../deps.ts";

//@deno-fmt-ignore
@applyOptions<NaticoSubCommandOptions>({
  id: "dm",
  name: "dm",
  subOf: "say",
  options: [
    {
      type: 3,
      name: "text",
      description: "text to dm",
      required: false,
    },
  ],
})
export default class dm extends NaticoSubCommand {
  exec(message: DiscordenoMessage, a: { text: string }) {
    message.member!.sendDM(a.text || "nothing");
  }
}
