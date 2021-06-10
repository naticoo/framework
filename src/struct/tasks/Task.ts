import { NaticoTaskHandler } from "./NaticoTaskHandler";
import { NaticoModule } from "../NaticoModule.ts";
export class NaticoTask extends NaticoModule {
  declare handler: NaticoTaskHandler;
  delay?: number;
  runOnStart?: boolean;
  constructor(
    id: string,
    { delay, runOnStart = false }: { delay?: number; runOnStart?: boolean },
  ) {
    super(id);
    this.delay = delay;
    this.runOnStart = runOnStart;
  }
  exec() {
    throw new Error(`${this.id} no implementated`);
  }
}
