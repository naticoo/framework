import { NaticoClient } from "../NaticoClient.ts";
import { NaticoCommand } from "./Command.ts";

import { Matches } from "../../util/Interfaces.ts";
import { DiscordenoMessage, Lexer, longShortStrategy, Parser } from "../../../deps.ts";
export class ArgumentGenerator {
  client: NaticoClient;
  constructor(client: NaticoClient) {
    this.client = client;
  }
  async generateArgs(command: NaticoCommand, message: DiscordenoMessage, args?: string) {
    if (!args) return {};
    const lout = new Lexer(args)
      .setQuotes([
        ['"', '"'],
        ["“", "”"],
        ["「", "」"],
      ])
      .lex();
    if (lout == null) {
      return null;
    }

    const parser = new Parser(lout).setUnorderedStrategy(longShortStrategy());
    const pout = parser.parse();
    const data: any = {};

    if (pout.flags) {
      const items = Array.from(pout.flags);
      for (const item in items) {
        data[items[item]] = true;
      }
    }
    if (pout.options) {
      for (const [key, value] of pout.options) {
        data[key] = value.join(" ");
      }
    }
    const rest: string[] = [];
    if (pout.ordered) {
      const items = pout.ordered;
      for (const item in items) {
        rest.push(items[item].value);
      }
    }
    if (command?.options) {
      let restContent = rest.join(" ");

      for (const option of command.options) {
        const name = option.name;

        //Rest means that everything will be cut off
        if (option.match == Matches.rest) {
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
        } else if (option.match == Matches.content) {
          if (option.customType) {
            data[name] = await option.customType(message, args);
          } else data[name] = args;
        }
      }
    }
    return data;
  }
}
