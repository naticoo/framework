import { NaticoClient } from "./NaticoClient.ts";
export interface NaticoModuleOptions {
  id: string;
}

export abstract class NaticoModule {
  handler!: any;
  client!: NaticoClient;
  id!: string;
  filepath!: string;
  constructor() {}

  reload() {
    return this.handler.reload(this.id);
  }

  remove() {
    return this.handler.remove(this.id);
  }

  toString() {
    return this.id;
  }
  abstract exec(...args: unknown[]): unknown | Promise<unknown>;
}
