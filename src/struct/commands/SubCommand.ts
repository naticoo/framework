import { NaticoCommand } from "./Command.ts";
import { PermissionStrings } from "../../../deps.ts";

import { ArgOptions } from "../../util/Interfaces.ts";
export class NaticoSubCommand extends NaticoCommand {
  subOf: string;
  constructor(
    id: string,
    {
      name,
      aliases,
      examples,
      description,
      enabled = true,
      slash,
      required,
      category,
      ownerOnly,
      superUserOnly,
      options,
      /**
       * The main command
       */
      subOf,
      clientPermissions,
      UserPermissions,
    }: {
      options?: ArgOptions[];
      subOf: string;
      name?: string;
      aliases?: string[];
      examples?: string[];
      description?: string;
      enabled?: boolean;
      slash?: boolean;
      required?: boolean;
      category?: string;
      ownerOnly?: boolean;
      superUserOnly?: boolean;
      clientPermissions?: PermissionStrings[];
      UserPermissions?: PermissionStrings[];
    }
  ) {
    super(id, {
      name,
      aliases,
      examples,
      description,
      enabled,
      slash,
      required,
      category,
      ownerOnly,
      superUserOnly,
      options,
      clientPermissions,
      UserPermissions,
    });
    this.subOf = subOf;
  }
}
