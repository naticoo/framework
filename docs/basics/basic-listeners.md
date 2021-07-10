# Basic listeners setup

Listeners are a way of getting events and running code on them

this guide assumes that you are already using the intro bot

```ts
//mod.ts
//Set the directory of the listener handler
...
	listenerHandler: NaticoListenerHandler = new NaticoListenerHandler(this, {
		directory: './listeners',
	});

	async start(token: string) {
        //Set the emitters
        //Emitter must be set before loading any listeners otherwise it will cause errors
		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
		});
        //Loading the stuff
		await this.listenerHandler.loadALL();
		await this.commandHandler.loadALL();
		return this.login(token);
	}
...

```

### Creating a listener

```ts
//listeners/ready.ts
import { NaticoListener } from "../deps.ts";
export default class ready extends NaticoListener {
  constructor() {
    super("ready", {
      //The emitter of the event
      emitter: "client",
      //THe event your listening for
      event: "ready",
    });
  }

  exec() {
    console.log("Bot has started");
  }
}
```

This a listener for the command handler but you can also listen to other events, For example the commandStarted event:

```js
import { ConvertedOptions, discordenoMessage, NaticoCommand, NaticoListener } from "../deps.ts";
export default class commandStarted extends NaticoListener {
  constructor() {
    super("commandStarted", {
      //In this example we are using the commandHandler that was specified in the mod.ts
      emitter: "commandHandler",
      event: "commandStarted",
    });
  }

  exec(message: discordenoMessage, command: NaticoCommand, args: ConvertedOptions) {
    console.log("command:", command.id, "started with args", args);
  }
}
```

Resulting code can be found [here](https://github.com/naticoo/examplebot/tree/main/basic-listeners)
