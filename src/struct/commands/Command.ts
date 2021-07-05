import { DiscordenoMessage, PermissionStrings } from "../../../deps.ts";
import { NaticoModule } from "../NaticoModule.js";
import { NaticoCommandHandler } from "./CommandHandler.ts";
import { ArgOptions, ConvertedOptions } from "../../util/Interfaces.ts";
export interface NaticoCommandOptions {
  options?: ArgOptions[];

  name?: string;
  aliases?: string[];
  examples?: string[];
  description?: string;
  slash?: boolean;
  category?: string;
  ownerOnly?: boolean;
  superUserOnly?: boolean;
  clientPermissions?: PermissionStrings[];
  userPermissions?: PermissionStrings[];
}
export class NaticoCommand extends NaticoModule {
  declare handler: NaticoCommandHandler;
  id: string;
  category: string;
  aliases: string[] | undefined;
  name: string;
  examples: string[] | undefined;
  ownerOnly: boolean | undefined;
  required: boolean | undefined;
  description: string | undefined;
  slash: boolean | undefined;
  enabled: boolean | undefined;
  superUserOnly: boolean | undefined;
  options?: ArgOptions[];
  clientPermissions: PermissionStrings[] | undefined;
  userPermissions: PermissionStrings[] | undefined;

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
      clientPermissions,
      userPermissions,
    }: NaticoCommandOptions
  ) {
    super(id);
    this.options = options;
    this.superUserOnly = superUserOnly;
    this.slash = slash;
    this.description = description;
    this.ownerOnly = ownerOnly;
    this.name = name?.toLowerCase() || id.toLowerCase();
    this.examples = examples || [`${name}`];
    this.clientPermissions = clientPermissions;
    this.userPermissions = userPermissions;
    this.id = id;

    this.aliases = aliases || [this.id];

    this.category = category || "general";
  }
  exec(_message: DiscordenoMessage, _options: ConvertedOptions | undefined | null): Promise<any> | any {
    throw new Error(`NOT_CREATED ${this.id}`);
  }
}
