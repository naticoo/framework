---
sidebar_position: 1
---

# Basic inhibitor setup

Inhibitors are a great way to prevent users from using certain commands or all

In this tutoroial ill show how to them up

this guide assumes that you are already using the intro bot

```ts
//mod.ts
...
//You are going to add this under the command handler
inhibitorHandler: NaticoInhibitorHandler = new NaticoInhibitorHandler(this, {
		directory: './inhibitors',
	});
...
	async start(token: string) {
		//Set the inhibitor handler to be used
		this.commandHandler.setInhibitorHandler(this.inhibitorHandler);
        //Then load the commands as usual
		await this.commandHandler.loadALL();
        //And the inhibitors
		await this.inhibitorHandler.loadALL();
		return this.login(token);
	}
...
```

## Creating a inhibitor

```ts
//inhibitors/notTricked.ts
import { DiscordenoMessage, NaticoCommand, NaticoInhibitor } from "../deps.ts";
export default class notTricked extends NaticoInhibitor {
  constructor() {
    super("notTricked", {
      //Higher priotiry = earlier fire
      priority: 1,
    });
  }

  exec(message: DiscordenoMessage, command: NaticoCommand): boolean {
    //This checks if the command thats being ran has the name ping
    if (command.name == "ping") {
      //Checks if the user their id is the one from tricked and if it isnt returns true
      //Returning true means the command is blocked
      if (message.authorId !== 336465356304678913n) {
        message.reply("You are not allowed to run this command");
        return true;
      }
    }
    //Otherwise it just runs the command
    return false;
  }
}
```

Resulting code can be found [here](https://github.com/naticoo/examplebot/tree/main/basic-inhibitors)
