import { NaticoCommand, DiscordenoMessage, cache, Matches, DiscordenoMember } from "../../deps.ts";
export default class bigSay extends NaticoCommand {
  constructor() {
    super("bigsay", {
      name: "bigsay",
      aliases: ["bigsay"],
      ownerOnly: true,
      options: [
        {
          type: 3,
          name: "user",
          description: "The user you want to dm",
          required: true,
          match: Matches.rest,
          customType: (message, content) => {
            //The last item in the array will be the new rest
            return [cache.members.get(BigInt(content.split(" ")[0])), content.split(" ").slice(1).join(" ")];
          },
        },
        {
          type: 3,
          name: "text",
          description: "text you want the bot to say",
          required: true,
          match: Matches.rest,
          customType: (message, content) => {
            return content.split(" ").reverse().join("🦀");
          },
        },
      ],
    });
  }
  async exec(message: DiscordenoMessage, { text, user }: { text: string; user: DiscordenoMember }) {
    if (user) await user.sendDM(text);
    message.reply(`dmed ${user.name} ${text}`);
  }
}
