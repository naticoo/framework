import {
  Bot,
  Cache,
  startBot,
  AsyncCache,
  CreateBotOptions,
  createBot,
  EventEmitter,
  EventHandlers,
  Collection,
} from "../../deps.ts";
import {
  NaticoButtonHandler,
  NaticoClient,
  NaticoCommandHandler,
  NaticoCommandHandlerOptions,
  NaticoInhibitorHandler,
  NaticoListenerHandler,
  NaticoTaskHandler,
} from "../mod.ts";

export interface NaticoPluginOptions {
  commandHandler?: NaticoCommandHandlerOptions | false;
  buttonHandler?: { directory: string } | false;
  inhibitorHandler?: { directory: string } | false;
  listenerHandler?: { directory: string } | false;
  taskHandler?: { directory: string } | false;
}

export interface NaticoBot<C extends Cache | AsyncCache = AsyncCache | Cache> extends Bot, EventEmitter {
  //@ts-ignore -
  commandHandler: NaticoCommandHandler<NaticoBot>;
  //@ts-ignore -
  buttonHandler: NaticoButtonHandler<NaticoBot>;
  //@ts-ignore -
  inhibitorHandler: NaticoInhibitorHandler<NaticoBot>;
  //@ts-ignore -
  listenerHandler: NaticoListenerHandler<NaticoBot>;
  //@ts-ignore -
  taskHandler: NaticoTaskHandler<NaticoBot>;
  login: () => Promise<void>;
}

// PLUGINS MUST TAKE A BOT ARGUMENT WHICH WILL BE MODIFIED
export function enableNaticoPlugin(
  inputBot: Partial<NaticoBot> & Bot,
  naticoOptions: NaticoPluginOptions
): NaticoBot & EventEmitter {
  //@ts-ignore -
  const bot = new (class extends NaticoClient {})({ intents: [], cache: { isAsync: false } }) as any;
  Object.assign(bot, inputBot);
  // MARK THIS PLUGIN BEING USED
  bot.enabledPlugins!.add("NATICO");

  // CUSTOMIZATION GOES HERE
  //@ts-ignore -
  if (naticoOptions.commandHandler) bot.commandHandler = new NaticoCommandHandler(bot, naticoOptions.commandHandler);
  //@ts-ignore -
  if (naticoOptions.buttonHandler) bot.buttonHandler = new NaticoButtonHandler(bot, naticoOptions.buttonHandler);
  if (naticoOptions.inhibitorHandler)
    //@ts-ignore -
    bot.inhibitorHandler = new NaticoInhibitorHandler(bot, naticoOptions.inhibitorHandler);
  if (naticoOptions.listenerHandler)
    //@ts-ignore -
    bot.listenerHandler = new NaticoListenerHandler(bot, naticoOptions.listenerHandler);
  //@ts-ignore -
  if (naticoOptions.taskHandler) bot.taskHandler = new NaticoTaskHandler(bot, naticoOptions.taskHandler);
  // bot.superOn = bot.on;
  // bot.addEvent = function (event: keyof EventHandlers) {
  //   //Removing the first argument since thats the bot every time!
  //   bot.events[event] = (...args: unknown[]) => this.emit(event, ...args.slice(1));
  //   console.log(bot.events[event]);
  // };
  // bot.on = function (eventName, listener) {
  //   bot.addEvent(eventName.toString() as keyof EventHandlers);
  //   return bot.superOn(eventName, listener);
  // };
  // bot.login = async function () {
  //   return await startBot(bot);
  // };
  return bot as unknown as any;
}
//@ts-ignore -
export function withPlugins<T = any>(botOptions: CreateBotOptions<CacheOptions>, ...plugins: any): T {
  let bot = createBot(botOptions);
  for (const plugin of plugins) {
    if (Array.isArray(plugin)) {
      const fun = plugin[0];
      const rest = plugin.slice(1);
      bot = fun(bot, ...rest);
    } else {
      let r = plugin(bot);
      if (r) bot = r;
    }
  }
  //@ts-ignore -
  if (!bot.cache.users) bot.cache.users = new Collection();
  //@ts-ignore -
  if (!bot.cache.activeGuildIds) bot.cache.activeGuildIds = new Set();
  if (!bot.events.debug) bot.events.debug = function () {};
  return bot as any;
}
