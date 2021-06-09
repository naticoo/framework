import { DiscordenoMessage } from "../../deps.ts";
export interface Events {
  [name: string]: (...args: any[]) => Promise<any> | any;
}
export interface ConvertedOptions {
  [name: string]: string;
}
export interface prefixFn {
  (message: DiscordenoMessage): string | string[] | Promise<string | string[]>;
}
