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
  id: "ping",
  name: "ping",
  aliases: ["ping"],
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
