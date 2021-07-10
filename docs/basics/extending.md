---
sidebar_position: 1
---

# Extending

this guide assumes that you are already using the basic-listeners bot

Extending is often useful to add new types to properties

```ts
//extensions/command.ts
import { NaticoCommand } from "../deps.ts";
import { BotClient } from "../mod.ts";
export class botCommand extends NaticoCommand {
  //Overwriting the old NaticoClient that was here with your custom one
  declare client: BotClient;
}
```

### Using your custom command

After extending NaticoCommand you need to import it to your commands

```ts
import { botCommand } from "../extensions/command.ts";
export default class listeners extends botCommand {
  constructor() {
    super("listeners", {
      name: "listeners",
      aliases: ["listeners"],
      description: "View the amount of listeners the bot has loaded",
    });
  }
  exec(message: discordenoMessage) {
    //Without extending this would have caused a type error
    message.reply(`Pong ${this.client.listenerHandler.modules.size} listeners`);
  }
}
```

You can find the resulting code [here](https://github.com/naticoo/examplebot/tree/main/extending)
