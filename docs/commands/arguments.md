Arguments are as easy as making slash commands in natico heres a quick example

A good way to make slash command arguments is to use [rauf.wtf](https://rauf.wtf/slash/)

```ts
//Some command.ts
import { NaticoCommand, DiscordenoMessage, cache, Matches, DiscordenoMember } from "../../deps.ts";
export default class bigSay extends NaticoCommand {
  constructor() {
    super("bigsay", {
      name: "bigsay",
      aliases: ["bigsay"],
      ownerOnly: true,
      options: [
        {
          type: 3,
          name: "user",
          description: "The user you want to dm",
          required: true,
          match: Matches.rest,
          customType: (message, content) => {
            //The last item in the array will be the new rest
            return [cache.members.get(BigInt(content.split(" ")[0])), content.split(" ").slice(1).join(" ")];
          },
        },
        {
          type: 3,
          name: "text",
          description: "text you want the bot to say",
          required: true,
          match: Matches.rest,
          customType: (message, content) => {
            return content.split(" ").reverse().join("🦀");
          },
        },
      ],
    });
  }
  async exec(message: DiscordenoMessage, { text, user }: { text: string; user: DiscordenoMember }) {
    if (user) await user.sendDM(text);
    message.reply(`dmed ${user.name} ${text}`);
  }
}
```

Even subcommands are handled the same way heres a quick example

```ts
import { NaticoClient, NaticoCommandHandler, NaticoClientOptions } from "../../deps.ts";
class BotClient extends NaticoClient {
  ...
  commandHandler: NaticoCommandHandler = new NaticoCommandHandler(this, {
    subType: "multiple",
  });
  ...
}
```

```ts
import { NaticoCommand, DiscordenoMessage } from "../../../deps.ts";
export default class say extends NaticoCommand {
  constructor() {
    super("say", {
      name: "say",
      aliases: ["say"],
      options: [
        {
          type: 1,
          name: "channel",
          description: "says the stuff in the current channel",
          options: [
            {
              type: 3,
              name: "text",
              description: "stuff you want to say in the channel",
              required: false,
            },
          ],
        },

        {
          type: 1,
          name: "dm",
          description: "dms you the stuff instead",
          options: [
            {
              type: 3,
              name: "text",
              description: "Things you want to dm the user",
              required: false,
            },
          ],
        },
      ],
    });
  }
  exec(message: DiscordenoMessage) {
    //It will default to this without arguments
    message.reply("Please chooose between " + this.options!.map((option) => option.name).join(", "));
  }
}
```

```ts
import { DiscordenoMessage, NaticoSubCommand } from "../../../../deps.ts";
export default class channel extends NaticoSubCommand {
  constructor() {
    super("channel", {
      name: "channel",
      subOf: "say",
      options: [
        {
          type: 3,
          name: "text",
          description: "stuff you want to say in the channel",
          required: false,
        },
      ],
    });
  }
  exec(message: DiscordenoMessage, a: { text: string }) {
    message.channel!.send(a.text || "nothing");
  }
}
```
