import { BotConfig, botId, EventEmitter, startBot } from "../../deps.ts";
import { Events } from "../util/Interfaces.ts";
import { NaticoClientUtil } from "../util/ClientUtil.ts";
export abstract class NaticoClient extends EventEmitter {
  events: Events = {};
  config: BotConfig;
  util!: NaticoClientUtil;

  constructor(config: NaticoClientOptions) {
    super();
    this.config = config;
    this.events = {};
    if (config?.util) this.util = new NaticoClientUtil(this);
  }

  get id() {
    return botId;
  }

  /**
   * @param event Add a event to be emitted
   */
  addEvent(event: string) {
    this.events[event] = (...args: unknown[]) => this.emit(event, ...args);
  }
  /**
   * Start the natico bot
   */
  async login() {
    return await startBot({
      token: this.config.token,
      intents: this.config?.intents ?? [],
      eventHandlers: this.events,
    });
  }
}

export interface NaticoClientOptions extends BotConfig {
  util?: boolean;
}
