import { NaticoClient, NaticoCommandHandler, NaticoClientOptions } from "../deps.ts";
class BotClient extends NaticoClient {
  constructor(public options: NaticoClientOptions) {
    super(options);
  }
  commandHandler: NaticoCommandHandler = new NaticoCommandHandler(this, {
    directory: "./commands",
    prefix: "!",
    owners: [336465356304678913n],
    guildonly: false,
  });
  async start() {
    await this.commandHandler.loadALL();
    return this.login();
  }
}
const botClient = new BotClient({ intents: ["Guilds", "GuildMessages", "GuildVoiceStates"], token: "" });
botClient.start();
