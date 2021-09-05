import { botCommand } from '../extensions/command.ts';
export default class listeners extends botCommand {
	constructor() {
		super('listeners', {
			name: 'listeners',
			aliases: ['listeners'],
			description: 'View the amount of listeners the bot has loaded',
		});
	}
	exec(message: discordenoMessage) {
		//Without extending this would have caused a type error
		message.reply(`Pong ${this.client.listenerHandler.modules.size} listeners`);
	}
}
