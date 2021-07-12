import { EventEmitter, Collection, DiscordenoMessage } from "../../deps.ts";
import { NaticoClient } from "../struct/NaticoClient.ts";

interface CollectorOptions {
  time?: number;
  max?: number;
}

type MessageCollection = Collection<bigint, DiscordenoMessage>;
type CollectorFilter = (message: DiscordenoMessage) => boolean;

export class MessageCollector extends EventEmitter {
  private collection: MessageCollection;
  private collected: number;
  private ended: boolean;

  constructor(
    client: NaticoClient,
    message: DiscordenoMessage,
    filter: CollectorFilter = () => {
      return true;
    },
    options: CollectorOptions = { max: 1, time: 10 * 1000 }
  ) {
    super();
    this.collection = new Collection();
    this.collected = 0;
    this.ended = false;

    const messageListener = (msg: DiscordenoMessage) => {
      if (message.channelId === msg.channelId && filter(msg) === true) {
        this.collection.set(msg.id, msg);
        this.collected += 1;
        this.emit("collect", msg);
      }

      if ((options.max ?? 1) <= this.collected && !this.ended) {
        client.removeListener("messageCreate", messageListener);
        this.emit("end", "limit", this.collection);
        this.ended = true;
        return;
      }
    };

    setTimeout(() => {
      if (this.ended) return;
      client.removeListener("messageCreate", messageListener);
      this.emit("end", "timeout", this.collection);
      this.ended = true;
    }, options.time);

    client.on("messageCreate", messageListener);
  }

  collect = new Promise<MessageCollection>((resolve, reject) => {
    this.once("end", (reason, collection) => {
      if (reason !== "timeout") resolve(collection);
      else reject(reason);
    });
  });
}
