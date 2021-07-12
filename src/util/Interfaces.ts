import { ApplicationCommandOption, DiscordenoMessage } from "../../discordeno_deps.ts";
import { NaticoCommandUtil } from "../struct/commands/commandUtil.ts";
export interface NaticoMessage extends DiscordenoMessage {
  util: NaticoCommandUtil;
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
  prompt?: string;
}
export type customType = (message: NaticoMessage | DiscordenoMessage | any, content: string) => any | Promise<any>;

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
