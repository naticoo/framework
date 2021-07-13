import { DiscordenoMessage, PermissionStrings } from "../../../deps.ts";
import { NaticoModule } from "../NaticoModule.js";
import { NaticoCommandHandler } from "./CommandHandler.ts";
import { ArgOptions } from "../../util/Interfaces.ts";
import { Arguments } from "./ArgumentGenerator.ts";
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
  ratelimit?: number;
  //Cooldown in ms
  cooldown?: number;
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
  cooldown?: number;
  ratelimit: number;
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
      cooldown,
      ratelimit = 3,
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
    this.cooldown = cooldown;
    this.ratelimit = ratelimit;
    this.id = id;

    this.aliases = aliases || [this.id];

    this.category = category || "general";
  }
  exec(_message: DiscordenoMessage, _options: Arguments): Promise<any> | any {
    throw new Error(`NOT_CREATED ${this.id}`);
  }
}
