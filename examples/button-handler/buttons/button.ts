import {
  sendInteractionResponse,
  DiscordenoMember,
  ComponentInteraction,
  NaticoButton,
  DiscordInteractionResponseTypes,
} from "../../deps.ts";
export default class button extends NaticoButton {
  constructor() {
    super("say", {
      trigger: "dothings",
    });
  }
  exec(interaction: ComponentInteraction, member: DiscordenoMember, params: string[]) {
    return sendInteractionResponse(interaction.id, interaction.token, {
      type: DiscordInteractionResponseTypes.ChannelMessageWithSource,
      private: false,
      data: {
        content: `You ( ${member.tag} ) Clicked <@${params}>'s button :flushed:`,
      },
    });
  }
}
