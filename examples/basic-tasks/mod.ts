import { NaticoClient, NaticoTaskHandler, NaticoClientOptions } from "../deps.ts";
class BotClient extends NaticoClient {
  constructor(public options: NaticoClientOptions) {
    super(options);
  }
  taskHandler: NaticoTaskHandler = new NaticoTaskHandler(this, {
    directory: "./tasks",
  });

  async start() {
    await this.taskHandler.loadALL();
    return this.login();
  }
}
const botClient = new BotClient({ intents: ["Guilds", "GuildMessages", "GuildVoiceStates"], token: "" });
botClient.start();
