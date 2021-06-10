import { NaticoClient } from "../NaticoClient.ts";
import { NaticoCommand } from "../commands/Command.ts";
import { NaticoHandler } from "../NaticoHandler.ts";
import { NaticoInhibitor } from "./Inhibitor.ts";
import { Collection, DiscordenoMessage } from "../../../deps.ts";
export class NaticoInhibitorHandler extends NaticoHandler {
  declare modules: Collection<string, NaticoInhibitor>;
  directory: string;

  constructor(client: NaticoClient, { directory }: { directory: string }) {
    super(client, {
      directory,
    });
    this.directory = directory;
    this.modules = new Collection();
  }
  async runChecks(
    message: DiscordenoMessage,
    command: NaticoCommand,
  ): Promise<boolean> {
    const inhibitors = [...this.modules.entries()].sort(
      (a, b) => b[1].priority - a[1].priority,
    );
    for await (const [, inhibitor] of inhibitors) {
      if (await inhibitor.exec(message, command)) return true;
      else continue;
    }
    return false;
  }
}
