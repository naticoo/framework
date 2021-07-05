import { NaticoCommand, NaticoCommandOptions } from "./Command.ts";
export interface NaticoSubCommandOptions extends NaticoCommandOptions {
  subOf: string;
}
export class NaticoSubCommand extends NaticoCommand {
  subOf: string;
  constructor(
    id: string,
    {
      name,
      aliases,
      examples,
      description,
      slash,
      category,
      ownerOnly,
      superUserOnly,
      options,
      /**
       * The main command
       */
      subOf,
      clientPermissions,
      userPermissions,
    }: NaticoSubCommandOptions
  ) {
    super(id, {
      name,
      aliases,
      examples,
      description,
      slash,
      category,
      ownerOnly,
      superUserOnly,
      options,
      clientPermissions,
      userPermissions,
    });
    this.subOf = subOf;
  }
}
