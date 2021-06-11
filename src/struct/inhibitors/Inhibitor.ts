import { DiscordenoMessage } from "../../../deps.ts";
import { NaticoModule } from "../NaticoModule.ts";
import { NaticoInhibitorHandler } from "./InhibitorHandler.ts";
import { NaticoCommand } from "../commands/Command.ts";
export class NaticoInhibitor extends NaticoModule {
  declare handler: NaticoInhibitorHandler;
  priority: number;
  constructor(id: string, { priority = 1 }: { priority?: number }) {
    super(id);
    this.priority = priority;
  }
  exec(_message: DiscordenoMessage, _command: NaticoCommand): Promise<boolean> | boolean {
    throw new Error(`${this.id} no implementated`);
  }
}
