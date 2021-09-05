import { NaticoCommand, Matches, DiscordenoMessage } from '../../deps.ts';
export default class say extends NaticoCommand {
	constructor() {
		super('say', {
			name: 'say',
			aliases: ['say'],
			options: [
				{
					//Args are setup like slash commands, later on ill make a arg parser for now this always gives strings
					type: 3,
					name: 'text',
					description: 'text you want the bot to say',
					required: true,
					match: Matches.rest,
				},
			],
		});
	}
	exec(message: DiscordenoMessage, { text }: { text: string }) {
		message.reply('Pong' + text);
	}
}
