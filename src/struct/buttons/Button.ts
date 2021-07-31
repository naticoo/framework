import { NaticoModule } from "../NaticoModule.js";
import { ComponentInteraction, DiscordenoMember } from "../../../deps.ts";
interface NaticoButtonOptions {
  trigger: string;
}
export abstract class NaticoButton extends NaticoModule {
  trigger: string;
  constructor(id: string, { trigger }: NaticoButtonOptions) {
    super(id);
    this.trigger = trigger;
  }
  abstract exec(
    interaction: ComponentInteraction,
    member: DiscordenoMember,
    params: string[]
  ): unknown | Promise<unknown> | undefined | null | Promise<undefined>;
}
