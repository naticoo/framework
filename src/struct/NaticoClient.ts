import { startBot, EventEmitter } from '../../deps.ts';
import { Events } from '../mod.ts';
import { ClientUtil } from '../util/mod.ts';
export class NaticoClient extends EventEmitter {
	public events: Events;
	public util!: ClientUtil;
	constructor({ util = false }: { util?: boolean }) {
		super();
		this.events = {};
		if (util) this.util = new ClientUtil(this);
	}
	/**
	 *
	 * @param event Add a event to be emitted
	 */
	addEvent(event: string) {
		this.events[event] = (...args: any[]) => this.emit(event, args);
	}
	/**
	 *
	 * @param token The token used for logging in
	 * @returns
	 */
	login(token: string) {
		return startBot({
			token,
			intents: ['Guilds', 'GuildMessages', 'GuildVoiceStates'],
			eventHandlers: this.events,
		});
	}
}
