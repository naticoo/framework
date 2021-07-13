import { NaticoClient } from "../NaticoClient.ts";
import { NaticoCommand } from "./Command.ts";

import { Matches, ArgOptions } from "../../util/Interfaces.ts";
import { MessageCollector } from "../../util/MessageCollector.ts";
import {
  DiscordenoMessage,
  fetchMembers,
  Collection,
  DiscordenoRole,
  DiscordenoChannel,
  DiscordenoMember,
} from "../../../deps.ts";

// All the items the parsers return
export type returnItems = DiscordenoRole | DiscordenoChannel | DiscordenoMember | number | string | boolean | undefined;

export type Argument = (
  message: DiscordenoMessage,
  args: string
) => [returnItems, string | undefined] | Promise<[returnItems, string | undefined]>;

export type ReturnType = [returnItems, string | undefined];

export type Arguments = { [name: string]: returnItems };

export class ArgumentGenerator {
  client: NaticoClient;
  arguments: Collection<string, Argument>;
  constructor(client: NaticoClient) {
    this.client = client;
    this.arguments = new Collection();
    this.start();
  }

  start() {
    //I would load the files dynamically but deno file loading is way to slow for that to be a good aproach
    this.arguments.set("3", (_, c) => [c, undefined]);
    this.arguments.set("4", (_, c) => [parseInt(c), undefined]);
    this.arguments.set("5", this.boolean);
    this.arguments.set("6", this.parseUser);
    this.arguments.set("7", this.parseChannel);
    this.arguments.set("8", this.parseRole);
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
    const data: Arguments = {};
    const rest = args.split(" ");
    if (command?.options) {
      let restContent: string | undefined = rest.join(" ");

      for (const option of command.options) {
        const name = option.name;
        if (option.type && !option.customType) {
          const res: [returnItems, string | undefined] = await this.arguments.get(option.type.toString())!(
            message,
            restContent as string
          );
          restContent = res[1];
          data[name] = res[0];
        }

        //Rest means that everything will be cut off
        if (option?.match == Matches.rest) {
          data[name] = args;
          if (option.customType) {
            const info: string = await option.customType(message, restContent as string);
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

  async handleMissingArgs(message: DiscordenoMessage, command: NaticoCommand, args: Arguments) {
    const argKeys = Object.keys(args);

    let index = 0;

    for await (const arg of command.options as ArgOptions[]) {
      if (argKeys[index] !== arg.name && arg.required && arg.prompt) {
        const prompt = await message.reply(`${arg.prompt}\nThe command be automatically cancelled in 30 seconds.`);

        const collector = new MessageCollector(this.client, message, undefined, { time: 30 * 1000 });
        const msg = (await collector.collect).first();

        if (!msg) return null;
        const fn = arg.customType ? arg.customType : this.arguments.get(arg.type.toString())!;
        args[arg.name] = (await fn(msg, msg.content))[0];
        await prompt.delete();
      }

      index++;
    }

    return args;
  }

  boolean(_: DiscordenoMessage, args: string) {
    const trues = ["true", "on", "enable"];
    const falses = ["false", "off", "disable"];
    if (trues.includes(args.split(" ")[0])) {
      args = args.split(" ").slice(1).join(" ");
      return [true, args] as ReturnType;
    } else if (falses.includes(args.split(" ")[0])) {
      args = args.split(" ").slice(1).join(" ");
      return [false, args] as ReturnType;
    }
    return [undefined, args] as ReturnType;
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

    if (user) return [user, args.split(" ").slice(1).join(" ")] as ReturnType;

    if (id && id[1]) {
      user = (
        await fetchMembers(message?.guild?.id!, message.guild?.shardId!, {
          userIds: [BigInt(id[1])],
          limit: 1,
        }).catch(() => undefined)
      )?.first();
    }
    if (user) return [user, args.split(" ").slice(1).join(" ")] as ReturnType;
    return [undefined, args] as ReturnType;
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

      return [channel, args.split(" ").slice(1).join(" ")] as ReturnType;
    }
    return [undefined, args] as ReturnType;
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

      return [role, args.split(" ").slice(1).join(" ")] as ReturnType;
    }
    return [undefined, args] as ReturnType;
  }
}
