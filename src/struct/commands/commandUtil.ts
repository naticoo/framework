// //Code semi-taken from https://github.com/SkyBlockDev/discord-akairo/blob/master/src/struct/commands/CommandUtil.js
// import { NaticoCommandHandler } from "./CommandHandler.ts";
// import {
//   Collection,
//   DiscordenoMessage,
//   CreateMessage,
//   SlashCommandInteraction,
//   editMessage,
//   sendMessage,
// } from "../../../deps.ts";
// import { NaticoClient } from "../NaticoClient.ts";

// /**
//  * The command util from natico which allows responding to interactions and much more
//  */
// export class NaticoCommandUtil<T extends NaticoClient> {
//   handler: NaticoCommandHandler<T>;
//   message: DiscordenoMessage;
//   shouldEdit: boolean;
//   lastResponse!: DiscordenoMessage;
//   isSlash = false;
//   parsed!: {
//     prefix: string;
//     alias: string;
//     isSlash?: boolean;
//   };
//   data: {
//     defered: boolean;
//     interaction?: SlashCommandInteraction;
//   } = {
//     defered: false,
//   };
//   // The message responses
//   messages: Collection<any, any> = new Collection();
//   constructor(handler: NaticoCommandHandler<T>, message: DiscordenoMessage) {
//     this.handler = handler;

//     this.message = message;

//     this.shouldEdit = false;

//     if (this.handler.storeMessages) {
//       this.messages = new Collection();
//     } else {
//       this.messages.clear();
//     }
//   }
//   /**
//    * Set the last response
//    */
//   setLastResponse(message: DiscordenoMessage) {
//     if (Array.isArray(message)) {
//       this.lastResponse = message.slice(-1)[0];
//     } else {
//       this.lastResponse = message;
//     }

//     return this.lastResponse;
//   }

//   addMessage(message: DiscordenoMessage) {
//     if (this.handler.storeMessages) {
//       if (Array.isArray(message)) {
//         for (const msg of message) {
//           this.messages.set(msg.id, msg);
//         }
//       } else {
//         this.messages.set(message.id, message);
//       }
//     }

//     return message;
//   }
//   setParsed(data: { prefix: string; alias: string }) {
//     this.parsed = data;
//   }

//   setEditable(state: boolean): this {
//     this.shouldEdit = Boolean(state);
//     return this;
//   }

//   async send(content: string | CreateMessage): Promise<DiscordenoMessage> {
//     if (this.shouldEdit) {
//       if (typeof content !== "string" && !content.embeds) content.embeds = [];
//       if (typeof content !== "string" && !content.content) content.content = "";

//       return (await editMessage(
//         this.handler.client,
//         this.lastResponse.channelId,
//         this.lastResponse.id,
//         content
//       )) as DiscordenoMessage;
//     }
//     if (this.parsed.isSlash) {
//       const oldContent = content;
//       content = {
//         //@ts-ignore -
//         type: 4,
//         data: oldContent,
//       };
//     }
//     const sent = await sendMessage(this.handler.client, this.message.channelId, content);
//     if (!this?.parsed?.isSlash) {
//       const lastSent = this.setLastResponse(sent as DiscordenoMessage);
//       this.setEditable(!lastSent?.attachments?.length);
//     }

//     return sent as DiscordenoMessage;
//   }

//   async sendNew(content: string | CreateMessage) {
//     const sent = await sendMessage(content);
//     const lastSent = this.setLastResponse(sent as DiscordenoMessage);
//     this.setEditable(!lastSent?.attachments?.length);
//     return sent;
//   }

//   reply(options: string | CreateMessage): Promise<DiscordenoMessage> {
//     //TODO: remove any type when dd fixes messageReference type
//     let newOptions: any = {};
//     if (!this?.parsed?.isSlash) {
//       if (typeof options == "string") {
//         newOptions.content = options;
//       } else {
//         newOptions = options;
//       }

//       if (!this.shouldEdit) {
//         newOptions.messageReference = {
//           messageId: this.message.id,
//         };
//       }
//     } else newOptions = options;

//     return this.send(newOptions);
//   }

//   edit(content: string | CreateMessage) {
//     return this.lastResponse.edit(content);
//   }
// }

// /**
//  * Extra properties applied to the Discord.js message object.
//  * @typedef {Object} MessageExtensions
//  * @prop {?CommandUtil} util - Utilities for command responding.
//  * Available on all messages after 'all' inhibitors and built-in inhibitors (bot, client).
//  * Not all properties of the util are available, depending on the input.
//  */
