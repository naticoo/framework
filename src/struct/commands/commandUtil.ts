//Code semi-taken from https://github.com/SkyBlockDev/discord-akairo/blob/master/src/struct/commands/CommandUtil.js
import { NaticoCommandHandler } from "./CommandHandler.ts";
import { Collection, DiscordenoMessage, CreateMessage, SlashCommandInteraction } from "../../../deps.ts";
/**
 * Command utilities.
 * @param {CommandHandler} handler - The command handler.
 * @param {Message} message - Message that triggered the command.
 */

export class NaticoCommandUtil {
  handler: NaticoCommandHandler;
  message: DiscordenoMessage;
  shouldEdit: boolean;
  lastResponse!: DiscordenoMessage;
  isSlash = false;
  parsed!: {
    prefix: string;
    alias: string;
    isSlash?: boolean;
  };
  data: {
    defered: boolean;
    interaction?: SlashCommandInteraction;
  } = {
    defered: false,
  };

  messages: Collection<any, any> = new Collection();
  constructor(handler: NaticoCommandHandler, message: DiscordenoMessage) {
    this.handler = handler;

    this.message = message;

    this.shouldEdit = false;

    if (this.handler.storeMessages) {
      this.messages = new Collection();
    } else {
      this.messages.clear();
    }
  }

  /**
   * Sets the last response.
   * @param {Message|Message[]} message - Message to set.
   * @returns {Message}
   */
  setLastResponse(message: DiscordenoMessage) {
    if (Array.isArray(message)) {
      this.lastResponse = message.slice(-1)[0];
    } else {
      this.lastResponse = message;
    }

    return this.lastResponse;
  }

  /**
   * Adds client prompt or user reply to messages.
   * @param {Message|Message[]} message - Message to add.
   * @returns {Message|Message[]}
   */
  addMessage(message: DiscordenoMessage) {
    if (this.handler.storeMessages) {
      if (Array.isArray(message)) {
        for (const msg of message) {
          this.messages.set(msg.id, msg);
        }
      } else {
        this.messages.set(message.id, message);
      }
    }

    return message;
  }
  setParsed(data: { prefix: string; alias: string }) {
    this.parsed = data;
  }
  /**
   * Changes if the message should be edited.
   * @param {boolean} state - Change to editable or not.
   * @returns {CommandUtil}
   */
  setEditable(state: boolean): this {
    this.shouldEdit = Boolean(state);
    return this;
  }

  /**
   * Sends a response or edits an old response if available.
   * @param {string | APIMessage | MessageOptions} options - Options to use.
   * @returns {Promise<Message|Message[]>}
   */
  async send(content: string | CreateMessage): Promise<DiscordenoMessage> {
    if (this.shouldEdit) {
      if (typeof content !== "string" && !content.embeds) content.embeds = [];
      if (typeof content !== "string" && !content.content) content.content = "";

      return (await this.lastResponse.edit(content)) as DiscordenoMessage;
    }
    if (this.parsed.isSlash) {
      const oldContent = content;
      content = {
        //@ts-ignore -
        type: 4,
        data: oldContent,
      };
    }
    const sent = await this.message.send(content);
    if (!this?.parsed?.isSlash) {
      const lastSent = this.setLastResponse(sent as DiscordenoMessage);
      this.setEditable(!lastSent?.attachments?.length);
    }

    return sent as DiscordenoMessage;
  }

  /**
   * Sends a response, overwriting the last response.
   * @param {string | APIMessage | MessageOptions} options - Options to use.
   * @returns {Promise<Message|Message[]>}
   */
  async sendNew(content: string | CreateMessage) {
    const sent = await this.message.send(content);
    const lastSent = this.setLastResponse(sent as DiscordenoMessage);
    this.setEditable(!lastSent?.attachments?.length);
    return sent;
  }

  /**
   * Send an inline reply to this message.
   * @param {string|ReplyMessageOptions|MessageAdditions} options - Options to use.
   * @returns {Promise<Message|Message[]>}
   */
  reply(options: string | CreateMessage): Promise<DiscordenoMessage> {
    let newOptions: any = {};
    if (!this?.parsed?.isSlash) {
      if (typeof options == "string") {
        newOptions.content = options;
      } else {
        newOptions = options;
      }

      if (!this.shouldEdit) {
        newOptions.messageReference = {
          messageId: this.message.id,
        };
      }
    } else newOptions = options;

    return this.send(newOptions);
  }

  /**
   * Edits the last response.
   * @param {string | MessageEditOptions | APIMessage} options - Options to use.
   * @returns {Promise<Message>}
   */
  edit(content: string | CreateMessage) {
    return this.lastResponse.edit(content);
  }
}

/**
 * Extra properties applied to the Discord.js message object.
 * @typedef {Object} MessageExtensions
 * @prop {?CommandUtil} util - Utilities for command responding.
 * Available on all messages after 'all' inhibitors and built-in inhibitors (bot, client).
 * Not all properties of the util are available, depending on the input.
 */
