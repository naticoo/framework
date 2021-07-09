import { NaticoClient } from "../NaticoClient.ts";
import { NaticoCommand } from "./Command.ts";

import { Matches } from "../../util/Interfaces.ts";
import { DiscordApplicationCommandOptionTypes, DiscordenoMessage, fetchMembers } from "../../../deps.ts";
export class ArgumentGenerator {
  client: NaticoClient;
  constructor(client: NaticoClient) {
    this.client = client;
  }
  /**
   * Parses the command arguments :stonks:
   * @param command
   * @param message
   * @param args
   * @returns
   */
  async handleArgs(command: NaticoCommand, message: DiscordenoMessage, args?: string) {
    if (!args) return {};
    // const lout = new Lexer(args)
    //   .setQuotes([
    //     ['"', '"'],
    //     ["“", "”"],
    //     ["「", "」"],
    //   ])
    //   .lex();
    // if (lout == null) {
    //   return null;
    // }

    // const parser = new Parser(lout).setUnorderedStrategy(longShortStrategy());
    // const pout = parser.parse();
    const data: any = {};

    // if (pout.flags) {
    //   const items = Array.from(pout.flags);
    //   for (const item in items) {
    //     data[items[item]] = true;
    //   }
    // }
    // if (pout.options) {
    //   for (const [key, value] of pout.options) {
    //     data[key] = value.join(" ");
    //   }
    // }
    // const rest: string[] = [];
    // if (pout.ordered) {
    //   const items = pout.ordered;
    //   for (const item in items) {
    //     rest.push(items[item].value);
    //   }
    // }
    // if (command?.options[0]?.type == DiscordApplicationCommandOptionTypes.SubCommand) {
    //   let restContent = rest.slice(1).join(" ");

    //   for (const option of command.options) {
    //     if (option.name == rest[0]) {
    //       for (const option of command.options) {
    //         [data, args, restContent] = await this.generateArgs(message, args, restContent, option, data);
    //       }
    //     }
    //   }
    // }
    const rest = args.split(" ");
    if (command?.options) {
      let restContent = rest.join(" ");

      for (const option of command.options) {
        const name = option.name;
        if (option.type && !option.customType) {
          if (option.type === DiscordApplicationCommandOptionTypes.String) {
            data[name] = restContent;
          }
          if (option.type === DiscordApplicationCommandOptionTypes.Integer) {
            data[name] = parseInt(restContent);
          }
          if (option.type === DiscordApplicationCommandOptionTypes.Boolean) {
            //TODO: Actually extract it
            const trues = ["true", "on", "enable"];
            const falses = ["false", "off", "disable"];
            if (trues.includes(restContent.split(" ")[0])) {
              restContent = restContent.split(" ").slice(1).join(" ");
              data[name] = true;
            } else if (falses.includes(restContent.split(" ")[0])) {
              restContent = restContent.split(" ").slice(1).join(" ");
              data[name] = false;
            }
          }
          if (option.type === DiscordApplicationCommandOptionTypes.User) {
            const member = this.parseUser(message, restContent);
            if (member) {
              data[name] = member;
              restContent = restContent.split(" ").slice(1).join(" ");
            }
          }
          if (option.type === DiscordApplicationCommandOptionTypes.Channel) {
            const channel = this.parseChannel(message, restContent);
            if (channel?.id) {
              data[name] = channel;
              restContent = restContent.split(" ").slice(1).join(" ");
            }
          }
          if (option.type === DiscordApplicationCommandOptionTypes.Role) {
            const role = this.parseRole(message, restContent);
            if (role?.id) {
              data[name] = role;
              restContent = restContent.split(" ").slice(1).join(" ");
            }
          }
        }

        //Rest means that everything will be cut off
        if (option?.match == Matches.rest) {
          data[name] = args;
          if (option.customType) {
            const info: string | any[] = await option.customType(message, restContent);
            if (Array.isArray(info) && info.length == 2) {
              restContent = info[1];

              data[name] = info[0];
            } else {
              data[name] = info;
            }
          } else data[name] = restContent;
        } else if (option?.match == Matches.content) {
          if (option.customType) {
            data[name] = await option.customType(message, args);
          } else data[name] = args;
        }
      }
    }
    return data;
  }
  async parseUser(message: DiscordenoMessage, args: string) {
    const item = args.trim().split(" ")[0].replace(/ /gi, "");

    const reg = /<@!?(\d{17,19})>/;
    const id = args.match(reg);

    let user = message.guild!.members.find((member) => {
      if (id && member.id == BigInt(id[1])) return true;
      if (!item.length) return false;
      if (member.name(message.guildId).toLowerCase().includes(item)) {
        return true;
      }
      if (member.tag.toLowerCase().includes(item)) true;
      return false;
    });
    if (user) return user;

    if (id && id[1]) {
      user = (
        await fetchMembers(message?.guild?.id!, message.guild?.shardId!, {
          userIds: [BigInt(id[1])],
          limit: 1,
        }).catch(() => undefined)
      )?.first();
    }

    return user;
  }
  parseChannel(message: DiscordenoMessage, args: string) {
    const guild = message.guild;

    const id = args.split(" ")[0].replace(/<|#|!|>|&|/gi, "");
    if ((id || args) && guild) {
      const channel = guild.channels.find((c) => {
        if (c.name == args.split(" ")[0]) return true;
        if (c.id.toString() == id || " ") return true;
        return false;
      });

      return channel;
    }
  }
  parseRole(message: DiscordenoMessage, args: string) {
    const guild = message.guild;

    const id = args.split(" ")[0].replace(/<|@|!|>|&|/gi, "");
    if ((id || args) && guild) {
      const role = guild.roles.find((c) => {
        if (c.name == args.split(" ")[0]) return true;
        if (c.id.toString() == id || " ") return true;
        return false;
      });

      return role;
    }
  }
}
/*
export enum ArgumentTypes {
  subCommand = 1,
  subCOmmandGroup = 2,
  string = 3,
  interger = 4,
  boolean = 5,
  user = 6,
  channel = 7,
}
*/
