import { NaticoEmbed } from "./Embed.ts";
import { NaticoClient } from "../struct/NaticoClient.ts";

export class ClientUtil {
  client: NaticoClient;
  constructor(client: NaticoClient) {
    this.client = client;
  }
  /**
	 * @returns a sneaky embed
	 */
  embed() {
    return new NaticoEmbed();
  }
}
