import { NaticoModule, NaticoModuleOptions } from "../NaticoModule.ts";
import { NaticoButtonHandler } from "./ButtonHandler.ts";
export interface NaticoButtonOptions extends NaticoModuleOptions {
  trigger: string;
}
export abstract class NaticoButton extends NaticoModule {
  declare handler: NaticoButtonHandler;
  trigger!: string;
}
