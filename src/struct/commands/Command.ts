import { PermissionStrings } from "../../../deps.ts";
import { NaticoModule } from "../NaticoModule.ts";
import { NaticoCommandHandler } from "./CommandHandler.ts";
import { ArgOptions } from "../../util/Interfaces.ts";
import { NaticoClient } from "../NaticoClient.ts";

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
  id: string;
}
/**
 * Create a natico command
 *
 * @example
 *```typescript
 * @applyOptions<NaticoCommandOptions>({
 *  name: "ping",
 *  description: "A simple ping command"
 * })
 * export default class Ping extends NaticoCommand {
 *  exec(message:DiscordenoMessage){
 *    return message.util.send({ content: "Hello from natico!" })
 *  }
 * }
 *```
 */
export abstract class NaticoCommand extends NaticoModule {
  declare handler: NaticoCommandHandler<NaticoClient>;
  category = "default";
  name: string = this.id;
  aliases: string[] | undefined = [this.name];
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
  ratelimit = 3;
}
