import { NaticoCommand } from '../../deps.ts';
import { BotClient } from '../mod.ts';
export class botCommand extends NaticoCommand {
	declare client: BotClient;
}
