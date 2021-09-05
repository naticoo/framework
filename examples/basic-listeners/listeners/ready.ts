import { NaticoListener } from '../../deps.ts';
export default class ready extends NaticoListener {
	constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
		});
	}

	exec() {
		console.log('Bot has started');
	}
}
