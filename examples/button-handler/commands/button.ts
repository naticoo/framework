import { NaticoCommand, DiscordenoMessage, NaticoComponents } from "../../deps.ts";
export default class button extends NaticoCommand {
  constructor() {
    super("button", {
      name: "button",
      aliases: ["button"],
    });
  }
  exec(message: DiscordenoMessage) {
    return message.util.reply({
      content: "Look a wild button!",
      components: new NaticoComponents().addButton("Clicky boi", "Primary", `dothings-${message.authorId}`),
    });
  }
}
