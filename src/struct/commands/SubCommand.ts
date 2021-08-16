import { NaticoCommand, NaticoCommandOptions } from "./Command.ts";
export interface NaticoSubCommandOptions extends NaticoCommandOptions {
  subOf: string;
}
export abstract class NaticoSubCommand extends NaticoCommand {
  subOf!: string;
}
