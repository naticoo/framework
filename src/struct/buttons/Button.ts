import { NaticoClient } from "../NaticoClient.ts";
import { NaticoModule, NaticoModuleOptions } from "../NaticoModule.ts";
import { NaticoButtonHandler } from "./ButtonHandler.ts";
export interface NaticoButtonOptions extends NaticoModuleOptions {
  trigger: string;
}
export abstract class NaticoButton<T extends NaticoClient> extends NaticoModule {
  declare handler: NaticoButtonHandler<T>;
  trigger!: string;
}
