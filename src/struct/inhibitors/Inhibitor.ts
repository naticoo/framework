import { NaticoModule, NaticoModuleOptions } from "../NaticoModule.ts";
import { NaticoInhibitorHandler } from "./InhibitorHandler.ts";

export interface NaticoInhibitorOptions extends NaticoModuleOptions {
  priority?: number;
}

export abstract class NaticoInhibitor extends NaticoModule {
  declare handler: NaticoInhibitorHandler;
  priority!: number;
}
