import {
  DiscordenoMember,
  NaticoClient,
  NaticoClientOptions,
  NaticoCommandHandler,
  NaticoInhibitorHandler,
  NaticoListenerHandler,
  NaticoTaskHandler,
} from "../deps.ts";
class BotClient extends NaticoClient {
  constructor(options: NaticoClientOptions) {
    super(options);
  }

  commandHandler = new NaticoCommandHandler(this, {
    directory: "./commands",
    prefix: "!",
    owners: [336465356304678913n],
    guildonly: false,
    subType: "single",
  });
  listenerHandler = new NaticoListenerHandler(this, {
    directory: "./listeners",
  });
  inhibitorHandler = new NaticoInhibitorHandler(this, {
    directory: "./inhibitors",
  });
  taskHandler = new NaticoTaskHandler(this, {
    directory: "./tasks",
  });
  async start() {
    await this.commandHandler.loadALL();
    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
    });
    await this.listenerHandler.loadALL();
    await this.inhibitorHandler.loadALL();
    await this.taskHandler.loadALL();

    return this.login();
  }
}
const botClient = new BotClient({
  intents: ["Guilds", "GuildMessages", "GuildVoiceStates"],
  //Replace this with your token
  token: Deno.env.get("TOKEN")!,
  cache: { isAsync: false },
  applicationId: 826480286169956413n,
});
//DO NOT AWAIT THIS IT WILL CAUSE ISSUES
botClient.start();
