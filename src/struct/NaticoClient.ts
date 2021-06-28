import { BotConfig, Client } from "../../deps.ts";
import { Events } from "../util/Interfaces.ts";
import { NaticoClientUtil } from "../util/ClientUtil.ts";
export class NaticoClient extends Client {
  events: Events = {};

  //Natico client util
  util!: NaticoClientUtil;

  constructor(config: NaticoClientOptions) {
    super(config);
    this.events = {};
    if (config?.util) this.util = new NaticoClientUtil(this);
  }
}

export interface NaticoClientOptions extends BotConfig {
  util?: boolean;
}
