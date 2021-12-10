import {
  Bot,
  EventEmitter,
  startBot,
  GenericFunction,
  WrappedFunction,
  createUtils,
  createTransformers,
  createRestManager,
  createHelpers,
  createGatewayManager,
  DiscordGatewayPayload,
  GatewayDispatchEventNames,
  EventHandlers,
  createBot,
  createBotConstants,
  CreateBotOptions,
  createEventHandlers,
  createBotGatewayHandlers,
  // createCache,
} from "../../deps.ts";
import { Events } from "../util/Interfaces.ts";
import { NaticoClientUtil } from "../util/ClientUtil.ts";
import { DiscordGatewayIntents } from "https://deno.land/x/discordeno@13.0.0-rc1/mod.ts";
export interface NaticoClientOptions extends Omit<CreateBotOptions, "events"> {
  util: boolean;
}
// deno-lint-ignore no-empty-interface
export interface NaticoClient extends Bot {}
export abstract class NaticoClient extends EventEmitter implements Bot {
  events = {} as EventHandlers;
  util!: NaticoClientUtil;

  constructor(config: NaticoClientOptions) {
    super();

    this.id = config.botId;
    this.applicationId = config.applicationId || config.botId;
    this.token = `Bot ${config.token}`;
    this.events = createEventHandlers({});
    this.intents = config.intents.reduce((bits, next) => (bits |= DiscordGatewayIntents[next]), 0);
    this.botGatewayData = config.botGatewayData;
    this.activeGuildIds = new Set<bigint>();
    this.constants = createBotConstants();
    this.handlers = createBotGatewayHandlers({});
    this.enabledPlugins = new Set();
    this.handleDiscordPayload = config.handleDiscordPayload;

    // @ts-ignore itoh cache types plz
    // this.cache = createCache(this as Bot, config.cache);

    if (config?.util) this.util = new NaticoClientUtil(this);
  }

  on(eventName: string | symbol, listener: GenericFunction | WrappedFunction) {
    this.addEvent(eventName.toString() as keyof EventHandlers);
    return super.on(eventName, listener);
  }
  /**
   * @param event Add a event to be emitted
   */
  addEvent(event: keyof EventHandlers) {
    //Removing the first argument since thats the bot every time!
    this.events[event] = (...args: unknown[]) => this.emit(event, ...args.slice(1));
  }

  /**
   * Start the natico bot
   */
  async login() {
    return await startBot(this);
  }
}
