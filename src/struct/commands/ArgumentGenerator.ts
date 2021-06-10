import { NaticoClient, NaticoCommand } from "../mod.ts";
import {
  Lexer,
  longShortStrategy,
  Parser,
} from "https://cdn.skypack.dev/lexure?dts";
import { Matches } from "../../mod.ts";
import { DiscordenoMessage } from "../../../deps.ts";
export class ArgumentGenerator {
  client: NaticoClient;
  constructor(client: NaticoClient) {
    this.client = client;
  }
  async generateArgs(
    command: NaticoCommand,
    message: DiscordenoMessage,
    args: string,
  ) {
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
      for (const option of command.options) {
        if (option.match == Matches.rest) {
          if (option.customType) {
            data[option.name] = await option.customType(
              message,
              rest.join(" "),
            );
          } else data[option.name] = rest.join(" ");
        } else if (option.match == Matches.content) {
          if (option.customType) {
            data[option.name] = await option.customType(message, args);
          } else data[option.name] = args;
        }
      }
    }
    return data;
  }
}
