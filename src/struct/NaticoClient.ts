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
  CreateBotOptions,
  createEventHandlers,
} from "../../deps.ts";
import { Events } from "../util/Interfaces.ts";
import { NaticoClientUtil } from "../util/ClientUtil.ts";
interface NaticoClientOptions extends Omit<CreateBotOptions, "events"> {
  util: boolean;
}
// deno-lint-ignore no-empty-interface
export interface NaticoClient extends Bot {}
export abstract class NaticoClient extends EventEmitter implements Bot {
  // utils!: Bot["utils"];
  // transformers!: Bot["transformers"];
  // helpers!: Bot["helpers"];
  // rest!: Bot["rest"];
  // gateway!: Bot["gateway"];
  // botGatewayData!: Bot["botGatewayData"];
  // token!: Bot["token"];
  // intents!: Bot["intents"];
  // handlers!: Bot["handlers"];
  // events!: Bot["events"];
  // cache!: Bot["cache"];
  // _events: Events = {};
  events = {} as EventHandlers;
  util!: NaticoClientUtil;

  constructor(config: NaticoClientOptions) {
    super();
    Object.assign(this, createBot({ ...config, events: createEventHandlers({}) }));
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
    this.utils = createUtils({});
    this.transformers = createTransformers(this.transformers || {});
    this.helpers = createHelpers(this.helpers || {});

    // START REST
    this.rest = createRestManager({ token: this.token });
    if (!this.botGatewayData) this.botGatewayData = await this.helpers.getGatewayBot(this);

    // START WS
    this.gateway = createGatewayManager({
      token: this.token,
      intents: this.intents,
      urlWSS: this.botGatewayData.url,
      shardsRecommended: this.botGatewayData.shards,
      sessionStartLimitTotal: this.botGatewayData.sessionStartLimit.total,
      sessionStartLimitRemaining: this.botGatewayData.sessionStartLimit.remaining,
      sessionStartLimitResetAfter: this.botGatewayData.sessionStartLimit.resetAfter,
      maxConcurrency: this.botGatewayData.sessionStartLimit.maxConcurrency,
      // bot.handleDiscordPayload ||
      handleDiscordPayload: async (_, data: DiscordGatewayPayload, shardId: number) => {
        // TRIGGER RAW EVENT
        this.events.raw(this, data, shardId);

        if (!data.t) return;

        // RUN DISPATCH CHECK
        await this.events.dispatchRequirements(this, data, shardId);
        if (data.t === "INTERACTION_CREATE") this.emit("RAW_INTERACTION", data, shardId);
        this.handlers[data.t as GatewayDispatchEventNames]?.(this, data, shardId);
      },
    });

    this.gateway.spawnShards(this.gateway);
  }
}
