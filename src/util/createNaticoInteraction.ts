import {
  DiscordenoMessage,
  SlashCommandInteraction,
  structures,
  cache,
  sendInteractionResponse,
  DiscordenoInteractionResponse,
  editSlashResponse,
} from "../../deps.ts";
import { NaticoCommandUtil } from "../struct/commands/commandUtil.ts";
export async function createNaticoInteraction(
  interaction: SlashCommandInteraction,
  handler: any
): Promise<DiscordenoMessage> {
  const guildId = BigInt(interaction.guildId!);
  const member = await structures.createDiscordenoMember(interaction.member!, guildId);

  const channelId = BigInt(interaction.channelId!);

  const reply = async (content: DiscordenoInteractionResponse) => {
    await sendInteractionResponse(interaction.id, interaction.token, content);
    const edit = (content: any) => editSlashResponse(interaction.token, content);
    return { edit };
  };

  const message: DiscordenoMessage | any = {
    id: BigInt(interaction.id),
    isBot: false,
    //   bitfield: interaction.bitfield,
    get tag() {
      return this.member!.tag;
    },
    get bitfield() {
      return this.member!.bitfield;
    },
    guildId: guildId,
    channelId: channelId,
    authorId: BigInt(interaction.member!.user.id),
    content: "",
    mentionedUserIds: [],
    mentionedRoleIds: [],
    get timestamp() {
      return Number(BigInt(this.id) / 4194304n + 1420070400000n);
    },
    member: member,
    get channel() {
      return cache.channels.get(channelId);
    },
    get guild() {
      return cache.guilds.get(guildId);
    },
    get link() {
      return `https://${this.guildId}/${this.channelId}/${this.id}`;
    },
    mentionedRoles: [],
    mentionedChannels: [],
    mentionedMembers: [],
    reply: reply,
    send: reply,
  };
  message.util = new NaticoCommandUtil(handler, message);

  message.util.parsed = {
    prefix: "/",
    isSlash: true,
  };
  message.util.data = {
    defered: false,
    interaction: interaction,
  };
  return message;
}
