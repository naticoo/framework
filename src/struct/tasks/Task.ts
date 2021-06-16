import { NaticoTaskHandler } from "./TaskHandler.ts";
import { NaticoModule } from "../NaticoModule.ts";
import { NaticoClient } from "../NaticoClient.ts";
export class NaticoTask extends NaticoModule {
  declare handler: NaticoTaskHandler;
  delay?: number | delayFN;
  runOnStart?: boolean;
  constructor(id: string, { delay, runOnStart = false }: { delay?: number; runOnStart?: boolean }) {
    super(id);
    this.delay = delay;
    this.runOnStart = runOnStart;
  }
  exec() {
    throw new Error(`${this.id} no implementated`);
  }
}
export type delayFN = (client: NaticoClient) => number;
