import { DiscordenoMessage } from '../../../deps.ts';
import { NaticoModule, NaticoInhibitorHandler, NaticoCommand } from '../mod.ts';
export class NaticoInhibitor extends NaticoModule {
	declare handler: NaticoInhibitorHandler;
	priority: number;
	constructor(id: string, { priority = 1 }: { priority?: number }) {
		super(id);
		this.priority = priority;
	}
	exec(
		_message: DiscordenoMessage,
		_command: NaticoCommand
	): Promise<boolean> | boolean {
		throw new Error(`${this.id} no implementated`);
	}
}
