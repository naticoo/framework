import { BotConfig, botId, EventEmitter, startBot } from "../../deps.ts";
import { Events } from "../util/Interfaces.ts";
import { NaticoClientUtil } from "../util/ClientUtil.ts";
export class NaticoClient extends EventEmitter {
  events: Events = {};
  util!: NaticoClientUtil;

  constructor(public config?: NaticoClientOptions) {
    super();
    this.events = {};
    if (this.config?.util) this.util = new NaticoClientUtil(this);
  }

  get id() {
    return botId;
  }

  /**
   *
   * @param event Add a event to be emitted
   */
  addEvent(event: string) {
    this.events[event] = (...args: any[]) => this.emit(event, ...args);
  }
  /**
   *
   * @param token The token used for logging in
   * @returns
   */
  async login(token = this.config?.token) {
    if (!token) throw new Error("TOKEN_NOT_PROVIDED");
    await startBot({
      token,
      intents: this.config?.intents ?? [],
      eventHandlers: this.events,
    });
  }
}

export interface NaticoClientOptions extends BotConfig {
  util?: boolean;
}
