import { ApplicationCommandOption, DiscordenoMessage } from "../../deps.ts";
export interface Events {
  [name: string]: (...args: any[]) => Promise<any> | any;
}
export interface ConvertedOptions {
  [name: string]: string;
}
export interface prefixFn {
  (message: DiscordenoMessage): string | string[] | Promise<string | string[]>;
}
export interface ArgOptions extends ApplicationCommandOption {
  match?: matches;
  customType?: customType;
}
export type customType = (
  message: DiscordenoMessage,
  content: string,
) => any | Promise<any>;

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
