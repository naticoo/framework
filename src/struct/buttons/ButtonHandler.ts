import { NaticoClient } from "../NaticoClient.ts";
import { NaticoButton } from "./Button.ts";
import { NaticoHandler } from "../NaticoHandler.js";
// import { NaticoInhibitor } from "./Inhibitor.ts";
import { Collection, DiscordInteractionTypes, ComponentInteraction, DiscordenoMember } from "../../../deps.ts";

export class NaticoButtonHandler extends NaticoHandler {
  declare modules: Collection<string, NaticoButton>;
  directory: string;

  constructor(client: NaticoClient, { directory }: { directory: string }) {
    super(client, {
      directory,
    });
    this.directory = directory;
    this.modules = new Collection();
    this.start();
  }
  start() {
    this.client.on("interactionCreate", async (data: ComponentInteraction, member: DiscordenoMember) => {
      if (data.type === DiscordInteractionTypes.MessageComponent) {
        const iDontKnowAnameForThis = data.data?.customId.split("-");
        if (!iDontKnowAnameForThis) return;
        const button = this.findButton(iDontKnowAnameForThis.shift());
        if (!button) return;
        try {
          if (button) return await button.exec(data, member, iDontKnowAnameForThis);
        } catch (error) {
          this.emit("buttonError", error, button);
        }
      }
    });
  }
  findButton(trigger?: string) {
    return this.modules.find((b) => b.trigger == trigger);
  }
}
