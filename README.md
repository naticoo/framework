<img align="right" src="https://avatars.githubusercontent.com/u/85624930?s=200&v=4" height="150px">

Discord API library for [Discordeno](https://github.com/discordeno/discordeno)

[![Discord](https://img.shields.io/discord/748956745409232945?color=7289da&logo=discord&logoColor=dark)](https://discord.gg/KkMKCchJb8)

Simple setup

```ts
import {
	NaticoClient,
	NaticoCommandHandler,
} from 'https://deno.land/x/natico@0.1.1/mod.ts';
class BotClient extends NaticoClient {
	constructor() {
		super({});
	}
	commandHandler: NaticoCommandHandler = new NaticoCommandHandler(this, {
		directory: './commands',
		prefix: '!',
	});
	async start(token: string) {
		await this.commandHandler.loadALL();
		return this.login(token);
	}
}
const botClient = new BotClient();
botClient.start(token);
```

For more information/docs visit the [examples](https://github.com/naticoo/examplebot) page
