import { ApplicationCommandOption, DiscordenoMessage } from "../../discordeno_deps.ts";
import { CommandUtil } from "../struct/commands/commandUtil.ts";
export interface NaticoMessage extends DiscordenoMessage {
  util: CommandUtil;
}
export interface Events {
  [name: string]: (...args: any[]) => Promise<any> | any;
}
export interface ConvertedOptions {
  [name: string]: any;
}
export interface prefixFn {
  (message: NaticoMessage): string | string[] | Promise<string | string[]>;
}
export interface ArgOptions extends ApplicationCommandOption {
  match?: Matches;
  customType?: customType;
}
export type customType = (message: NaticoMessage, content: string) => any | Promise<any>;

export enum Matches {
  rest,
  content,
}
export enum ArgumentTypes {
  string = 3,
  interger = 4,
  boolean = 5,
  user = 6,
  channel = 7,
  subCommand = 1,
  subCOmmandGroup = 2,
}
