import { DiscordenoMessage, PermissionStrings } from "../../../deps.ts";
import { NaticoModule } from "../NaticoModule.ts";
import { NaticoCommandHandler } from "./CommandHandler.ts";
import { ArgOptions, ConvertedOptions } from "../../util/Interfaces.ts";
export class NaticoCommand extends NaticoModule {
  declare handler: NaticoCommandHandler;
  id: string;
  category: string | undefined;
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
  permissions: PermissionStrings[] | undefined;

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
      permissions,
    }: {
      options?: ArgOptions[];

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
      permissions?: PermissionStrings[];
    }
  ) {
    super(id);
    this.options = options;
    this.superUserOnly = superUserOnly;
    this.enabled = enabled;
    this.slash = slash;
    this.description = description;
    this.required = required;
    this.ownerOnly = ownerOnly;
    this.name = name?.toLowerCase() || id.toLowerCase();
    this.examples = examples || [`${name}`];
    this.permissions = permissions;

    this.id = id;

    this.aliases = aliases || [this.id];

    this.category = category || "general";
  }
  exec(_message: DiscordenoMessage, _options: ConvertedOptions | undefined | null): Promise<any> | any {
    throw new Error(`NOT_CREATED ${this.id}`);
  }
}
