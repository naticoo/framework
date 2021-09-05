import {
  applyOptions,
  DiscordenoMessage,
  NaticoCommand,
  NaticoCommandOptions,
} from "../../deps.ts";

//@deno-fmt-ignore
@applyOptions<NaticoCommandOptions>(
  {
    id: "say",
    name: "say",
    aliases: ["say"],
    options: [
      //You dont have to add the options here but its recomended once natico is compatible with slash commands
      {
        type: 1,
        name: "channel",
        description: "says the stuff in the current channel",
      },

      {
        type: 1,
        name: "dm",
        description: "dms you the stuff instead",
      },
    ],
  },
)
export default class say extends NaticoCommand {
  exec(message: DiscordenoMessage) {
    //It will default to this without arguments
    message.reply(
      "Please chooose between " +
        this.options!.map((option) => option.name).join(", "),
    );
  }
}
