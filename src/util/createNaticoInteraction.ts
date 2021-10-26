import {
  sendInteractionResponse,
  DiscordenoInteractionResponse,
  DiscordenoMember,
  DiscordenoGuild,
  DiscordenoChannel,
  DiscordenoUser,
} from "../../deps.ts";
import { NaticoClient } from "../mod.ts";
// enum APPLICATION_COMMAND_VALUES {
//   SUB_COMMAND = 1,
//   SUB_COMMAND_GROUP = 2,
//   STRING = 3,
//   //Any integer between -2^53 and 2^53
//   INTEGER = 4,
//   BOOLEAN = 5,
//   USER = 6,
//   //	Includes all channel types + categories
//   CHANNEL = 7,
//   ROLE = 8,
//   //Includes users and roles
//   MENTIONABLE = 9,
//   //	Any double between -2^53 and 2^53
//   NUMBER = 10,
// }
export class NaticoInteraction<T extends NaticoClient> {
  // values.map((x) => ({
  //   ...x,
  //   parsed:
  //     x.type === APPLICATION_COMMAND_VALUES.BOOLEAN
  //       ? x.value
  //       : x.type === APPLICATION_COMMAND_VALUES.CHANNEL
  //       ? cache.channels.get(BigInt(x.value))
  //       : x.type === APPLICATION_COMMAND_VALUES.INTEGER
  //       ? x.value
  //       : x.type === APPLICATION_COMMAND_VALUES.MENTIONABLE
  //       ? cache.channels.get(x.value)
  //       : x.type === APPLICATION_COMMAND_VALUES.NUMBER
  //       ? x.value
  //       : x.type === APPLICATION_COMMAND_VALUES.ROLE,
  // }));
  id: bigint;
  name: string;
  type: number;
  version: number;
  token: string;
  bot: T;
  resolved: any;
  options: any;
  data: any;
  member?: DiscordenoMember;
  guildId: bigint;
  applicationId: bigint;
  user: DiscordenoUser;
  channelId?: bigint;
  guild?: DiscordenoGuild;
  channel?: DiscordenoChannel;
  constructor(payload: any, bot: T) {
    console.log(payload);
    this.bot = bot;

    this.token = payload.token;
    this.name = payload.data.name;
    this.type = payload.type;
    this.version = payload.version;
    this.resolved = payload.resolved;
    this.options = payload.options;
    this.data = payload.data;
    this.guildId = payload.guild_id;
    this.id = bot.transformers.snowflake(payload.id);
    this.applicationId = bot.transformers.snowflake(payload.application_id);
    this.user = bot.transformers.user(bot, payload.member?.user || payload.user!);
    this.channelId = payload.channel_id ? bot.transformers.snowflake(payload.channel_id) : undefined;
    this.member =
      payload.member && this.guildId
        ? bot.transformers.member(bot, payload.member, this.guildId, this.user.id)
        : undefined;
    // this.member = bot.transformers.member(this.bot, payload.member, payload.guild_id, payload.member.user.id);
    // this.guild = bot.transformers.guild(this.bot, payload.guild_id);
    // this.channel = bot.transformers.channel(this.bot, payload.guild_id);
  }
  async reply(content: DiscordenoInteractionResponse) {
    return await sendInteractionResponse(this.bot, this.id, this.token, content);
  }
  async send(content: DiscordenoInteractionResponse) {
    return await sendInteractionResponse(this.bot, this.id, this.token, content);
  }
  async delete() {}
}
// import {
//   DiscordenoMessage,
//   SlashCommandInteraction,
//   sendInteractionResponse,
//   DiscordenoInteractionResponse,
//   editSlashResponse,
//   snowflakeToBigint,
// } from "../../deps.ts";
// import { NaticoCommandUtil } from "../struct/commands/commandUtil.ts";
// export async function createNaticoInteraction(
//   interaction: SlashCommandInteraction,
//   handler: any
// ): Promise<DiscordenoMessage> {
//   const message = {};
//   // const guildId = snowflakeToBigint(interaction.guildId ?? "0");
//   // const member = await structures.createDiscordenoMember(interaction.member!, guildId);

//   // const channelId = BigInt(interaction.channelId!);

//   // const reply = async (content: DiscordenoInteractionResponse) => {
//   //   await sendInteractionResponse(interaction.id, interaction.token, content);
//   //   const edit = (content: any) => editSlashResponse(interaction.token, content);
//   //   return { edit };
//   // };

//   // const message: DiscordenoMessage | any = {
//   //   id: snowflakeToBigint(interaction.id),
//   //   isBot: false,
//   //   //   bitfield: interaction.bitfield,
//   //   get tag() {
//   //     return this.member!.tag;
//   //   },
//   //   get bitfield() {
//   //     return this.member!.bitfield;
//   //   },
//   //   guildId: guildId,
//   //   channelId: channelId,
//   //   authorId: snowflakeToBigint(interaction.member!.user.id),
//   //   content: "",
//   //   mentionedUserIds: [],
//   //   mentionedRoleIds: [],
//   //   get timestamp() {
//   //     return Number(snowflakeToBigint(this.id) / 4194304n + 1420070400000n);
//   //   },
//   //   member: member,
//   //   get channel() {
//   //     return cache.channels.get(channelId);
//   //   },
//   //   get guild() {
//   //     return cache.guilds.get(guildId);
//   //   },
//   //   get link() {
//   //     return `https://${this.guildId}/${this.channelId}/${this.id}`;
//   //   },
//   //   mentionedRoles: [],
//   //   mentionedChannels: [],
//   //   mentionedMembers: [],
//   //   reply: reply,
//   //   send: reply,
//   // };
//   // message.util = new NaticoCommandUtil(handler, message);

//   // message.util.parsed = {
//   //   prefix: "/",
//   //   isSlash: true,
//   // };
//   // message.util.data = {
//   //   defered: false,
//   //   interaction: interaction,
//   // };
//   return message as any;
// }
