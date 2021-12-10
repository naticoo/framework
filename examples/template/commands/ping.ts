import {
  applyOptions,
  DiscordenoInteraction,
  NaticoCommand,
  NaticoCommandOptions,
  sendInteractionResponse,
  InteractionApplicationCommandCallbackData,
} from "../../deps.ts";

//@deno-fmt-ignore
@applyOptions<NaticoCommandOptions>({
  id: "stats",
  name: "stats",
  aliases: ["stats", "stats"],
})
export default class ping extends NaticoCommand {
  async exec(message: DiscordenoInteraction) {
    await this.client.helpers.sendInteractionResponse(message.id, message.token, {
      type: 4,
      data: {
        content: "My response",
      },
    });
  }
}
