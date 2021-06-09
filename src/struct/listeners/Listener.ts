import { NaticoModule } from "../mod.ts";
export class NaticoListener extends NaticoModule {
  event: string;
  emitter: string;
  constructor(
    id: string,
    { event, emitter }: { event: string; emitter: string },
  ) {
    super(id);
    this.emitter = emitter;
    this.event = event;
  }
  exec(..._args: any[]) {
    throw new Error(`${this.id} no implementated`);
  }
}
