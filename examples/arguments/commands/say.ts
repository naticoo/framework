import { NaticoCommand, DiscordenoMessage, Matches } from '../../deps.ts';
export default class say extends NaticoCommand {
	constructor() {
		super('say', {
			name: 'say',
			aliases: ['say'],
			options: [
				{
					type: 3,
					name: 'text',
					description: 'text you want the bot to say',
					required: true,
					match: Matches.rest,
					customType: (message, content) => {
						return content.split(' ').reverse().join('🦀');
					},
				},
			],
		});
	}
	exec(message: DiscordenoMessage, { text }: { text: string }) {
		message.reply(text);
	}
}
