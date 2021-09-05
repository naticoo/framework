import { NaticoClient, NaticoCommandHandler, NaticoInhibitorHandler, NaticoClientOptions } from "../deps.ts";
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
  inhibitorHandler: NaticoInhibitorHandler = new NaticoInhibitorHandler(this, {
    directory: "./inhibitors",
  });
  async start() {
    //Set the inhibitor handler to be used
    this.commandHandler.setInhibitorHandler(this.inhibitorHandler);
    await this.commandHandler.loadALL();
    await this.inhibitorHandler.loadALL();
    return this.login();
  }
}
const botClient = new BotClient({ intents: ["Guilds", "GuildMessages", "GuildVoiceStates"], token: "" });
botClient.start();
