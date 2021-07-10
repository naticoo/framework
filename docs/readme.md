# Tutorial Intro

Let's discover **Natico in less than 5 minutes**.

## Getting Started

Get started by **Downloading [deno](https://deno.land/)**.

First of you are going to create a deps.ts file with the following code we do this so we can import everything from the deps.ts file when you need to import more things

```ts
//deps.ts
export * from "https://deno.land/x/natico/mod.ts";
```

### Creating the bot client

Then create a mod.ts file with the following code

```ts
//mod.ts
import { NaticoCommandHandler, NaticoClient } from "./deps.ts";
class BotClient extends NaticoClient {
  constructor(public options?: NaticoClientOptions) {
    super(options);
  }
  // This is the command handler that will be handling your commands
  commandHandler: NaticoCommandHandler = new NaticoCommandHandler(this, {
    directory: "./commands",
    prefix: "!",
  });
  async start(token: string) {
    // Loading its modules
    await this.commandHandler.loadALL();
    //Then just simply login
    return this.login(token);
  }
}
const botClient = new BotClient({
  intents: ["Guilds", "GuildMessages", "GuildVoiceStates"],
});
botClient.start("Insert your token here");
```

### Creating your first command

Then we will be making our first command

```ts
//commands/ping.ts
import { NaticoCommand, DiscordenoMessage } from "../deps.ts";
export default class ping extends NaticoCommand {
  constructor() {
    super("ping", {
      name: "ping",
      aliases: ["ping"],
    });
  }
  exec(message: DiscordenoMessage) {
    message.reply("Pong");
  }
}
```

And now your all set to start creating your bot with discordeno and natico

All resulting code can be found [here](https://github.com/naticoo/examplebot/tree/main/basic-commands)

api documentation can be found [here](https://doc.deno.land/https/deno.land/x/natico/mod.ts) once the deno team learns how to code

Full bot examples can be found [here](https://github.com/naticoo/examplebot/tree/main)
