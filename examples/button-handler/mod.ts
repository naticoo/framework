import { NaticoClient, NaticoCommandHandler, NaticoClientOptions, NaticoButtonHandler } from "../deps.ts";
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
  buttonHandler: NaticoButtonHandler = new NaticoButtonHandler(this, {
    directory: "./buttons",
  });
  async start() {
    await this.commandHandler.loadALL();
    await this.buttonHandler.loadALL();
    return this.login();
  }
}
const botClient = new BotClient({
  intents: ["Guilds", "GuildMessages", "GuildVoiceStates"],
  token: "",
});
botClient.start();
