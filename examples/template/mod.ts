import {
  cache,
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
  cache = cache;
  get user() {
    return this.cache.members.get(this.id) as DiscordenoMember;
  }
  commandHandler: NaticoCommandHandler = new NaticoCommandHandler(this, {
    directory: "./commands",
    prefix: "!",
    owners: [336465356304678913n],
    guildonly: false,
    subType: "single",
  });
  listenerHandler: NaticoListenerHandler = new NaticoListenerHandler(this, {
    directory: "./listeners",
  });
  inhibitorHandler: NaticoInhibitorHandler = new NaticoInhibitorHandler(this, {
    directory: "./inhibitors",
  });
  taskHandler: NaticoTaskHandler = new NaticoTaskHandler(this, {
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
});
//DO NOT AWAIT THIS IT WILL CAUSE ISSUES
botClient.start();
