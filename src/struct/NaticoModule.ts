import { NaticoClient, NaticoHandler } from './mod.ts';
import { EventEmitter } from '../util/EventEmitter.ts';
export class NaticoModule extends EventEmitter {
	handler!: NaticoHandler;
	client!: NaticoClient;
	id: string;
	filepath!: string;
	constructor(id: string) {
		super();
		this.id = id;
		this.filepath;
		this.handler;
	}

	reload() {
		return this.handler.reload(this.id);
	}

	remove(): NaticoModule | undefined {
		return this.handler.remove(this.id);
	}

	toString() {
		return this.id;
	}
	exec() {
		throw new Error(`NO_EXEC ${this.id}`);
	}
}
