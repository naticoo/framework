<img align="right" src="https://avatars.githubusercontent.com/u/85624930?s=200&v=4" height="150px" style=" border-radius: 8px;">

# Natico

Natico is designed to be a low level and extendable framework for [Discordeno](https://github.com/discordeno/discordeno)

[![Discord](https://img.shields.io/discord/748956745409232945?style=plastic&color=7289da&logo=discord&logoColor=dark)](https://discord.gg/KkMKCchJb8)
[![lines](https://img.shields.io/tokei/lines/github/naticoo/framework?style=plastic&color=7289da&logo=superuser&logoColor=dark)](https://deno.land/x/natico)
[![lines](https://img.shields.io/website?style=plastic&up_message=online&url=https%3A%2F%2Fnatico.mod.land&color=7289da&logo=React&logoColor=dark)](https://natico.mod.land)

## Simple setup

```ts
import { NaticoClient, NaticoClientOptions, NaticoCommandHandler } from "https://deno.land/x/natico/mod.ts";
class BotClient extends NaticoClient {
  constructor(public options?: NaticoClientOptions) {
    super(options);
  }
  commandHandler: NaticoCommandHandler = new NaticoCommandHandler(this, {
    directory: "./commands",
    prefix: "!",
  });
  async start() {
    await this.commandHandler.loadALL();
    return this.login();
  }
}
const botClient = new BotClient({
  intents: ["Guilds", "GuildMessages", "GuildVoiceStates"],
  token: "your token",
});
botClient.start();
```

### Features

- flexible
  - Natico is built using classes allowing you to extend everything and add
    features to your liking
- Command handling
  - Natico has great command handling with slash command support on its way
- Listeners
  - Natico comes included with a listener(events) handler which makes it very
    easy to use events
- And much more

This project is inspired by [discord-akairo](https://github.com/discord-akairo/discord-akairo)

For more information/docs visit the [examples](https://github.com/naticoo/examplebot) page
