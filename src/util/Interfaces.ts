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
  //The custom function that will be ran instead of the default argument function
  customType?: customType;
  //The prompt that will be given when a user doesnt provide that argument
  prompt?: string;
  //If the option is a channel type, the channels shown will be restricted to these types
  channel_types?: string[];
  //If the option is an INTEGER or NUMBER type, the minimum value permitted
  min_value?: number;
  //If the options is an INTEGER or NUMBER type, the maximum value permitted
  max_value?: number;
  //Enable autocomplete interactions for this option
  autocomplete?: boolean;
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
