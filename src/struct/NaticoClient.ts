import { botId, EventEmitter, startBot } from "../../deps.ts";
import { Events } from "../util/Interfaces.ts";
import { ClientUtil } from "../util/ClientUtil.ts";
export class NaticoClient extends EventEmitter {
  public events: Events;
  public util!: ClientUtil;
  public id: BigInt;
  constructor({ util = false }: { util?: boolean }) {
    super();
    this.events = {};
    this.id = botId;
    if (util) this.util = new ClientUtil(this);
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
  login(token: string) {
    return startBot({
      token,
      intents: ["Guilds", "GuildMessages", "GuildVoiceStates"],
      eventHandlers: this.events,
    });
  }
}
