import {
  ConvertedOptions,
  discordenoMessage,
  NaticoCommand,
  NaticoListener,
} from "../../deps.ts";
export default class commandStarted extends NaticoListener {
  constructor() {
    super("commandStarted", {
      emitter: "commandHandler",
      event: "commandStarted",
    });
  }

  exec(
    message: discordenoMessage,
    command: NaticoCommand,
    args: ConvertedOptions,
  ) {
    console.log("command:", command.id, "started with args", args);
  }
}
