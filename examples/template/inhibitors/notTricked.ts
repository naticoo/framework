import { applyOptions, DiscordenoMessage, NaticoCommand, NaticoInhibitor, NaticoInhibitorOptions } from "../../deps.ts";

//@deno-fmt-ignore
@applyOptions<NaticoInhibitorOptions>({
  id: "notTricked",
  //Higher priotiry = earlier fire
  priority: 1,
})
export default class notTricked extends NaticoInhibitor {
  exec(message: DiscordenoMessage, command: NaticoCommand): boolean {
    if (command.name == "say") {
      if (message.authorId !== 336465356304678913n) return true;
    }
    message.reply("You are not allowed to run this command");
    return false;
  }
}
