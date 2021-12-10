import { enableNaticoPlugin, NaticoBot, NaticoPluginOptions, withPlugins } from "../src/plugins/NaticoPlugin.ts";
import { enableCachePlugin, enableCacheSweepers } from "https://deno.land/x/discordeno_cache_plugin@0.0.9/mod.ts";

const pluginOps: NaticoPluginOptions = {
  commandHandler: {
    directory: "examples/template/commands",
    prefix: "!",
  },
};

const bot = withPlugins<NaticoBot>(
  //@ts-ignore -
  {
    token: Deno.env.get("DISCORD_TOKEN")!,
    intents: ["Guilds", "GuildMessages"],
    botId: BigInt(Deno.env.get("BOT_ID")!),
    cache: {
      isAsync: false,
    },
    events: {
      ready() {
        console.log("Successfully connected to gateway");
      },
      messageCreate(_bot, message) {
        // Process the message with your command handler here
      },
    },
  },
  [enableNaticoPlugin, pluginOps],
  enableCachePlugin,
  enableCacheSweepers
);
console.log(bot.cache);
async function startUp() {
  await bot.commandHandler.loadALL();
  return await bot.login();
}
startUp();
