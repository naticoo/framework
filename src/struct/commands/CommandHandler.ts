import {
	Collection,
	DiscordenoMessage,
	EditGlobalApplicationCommand,
	hasGuildPermissions,
	upsertSlashCommands,
} from '../../../deps.ts';
import {
	NaticoClient,
	NaticoCommand,
	NaticoHandler,
	NaticoInhibitorHandler,
} from '../mod.ts';
import { ConvertedOptions, prefixFn } from '../../util/mod.ts';
export class NaticoCommandHandler extends NaticoHandler {
	modules: Collection<string, NaticoCommand>;
	cooldowns: Set<string>;
	IgnoreCD: string[];
	owners: string[];
	cooldown: number;
	superusers: string[];
	guildonly: boolean;
	prefix: prefixFn | string | string[];
	handleEdits: boolean;
	inhibitorHandler!: NaticoInhibitorHandler;
	// handleSlashes: boolean;
	constructor(
		client: NaticoClient,
		{
			directory = './commands',
			prefix = '!',
			IgnoreCD = [],
			owners = [],
			cooldown = 5000,
			superusers = [],
			guildonly = false,
			handleEdits = false,
		}: // handleSlashes = true,
		{
			directory?: string;
			prefix?: prefixFn | string | string[];
			IgnoreCD?: string[];
			owners?: string[];
			/**
			 * cooldown in millieseconds
			 */
			cooldown?: number;
			rateLimit?: number;
			superusers?: string[];
			/**
			 * Commands will only work in guild channels with this on
			 */
			guildonly?: boolean;
			handleEdits?: boolean;
			// handleSlashes?: boolean;
		}
	) {
		super(client, {
			directory,
		});
		// this.handleSlashes = handleSlashes;
		this.handleEdits = handleEdits;
		this.client = client;
		this.prefix = prefix;
		this.owners = owners;
		this.cooldown = cooldown;
		this.superusers = [...owners, ...superusers];
		this.IgnoreCD = [...IgnoreCD, ...this.superusers];
		this.cooldowns = new Set();
		this.guildonly = guildonly;
		this.modules = new Collection();
		this.start();
	}
	start() {
		if (this.handleEdits) {
			this.client.addEvent('messageUpdate');
			this.client.on('messageUpdate', (message) => {
				return this.handleCommand(message as DiscordenoMessage);
			});
		}
		// if (this.handleSlashes) {
		// 	this.client.addEvent('interactionCreate');
		// 	this.client.on('interactionCreate', ([data]) => {
		// 		if (data.type === DiscordInteractionTypes.ApplicationCommand)
		// 			return this.handleSlashCommand(message as DiscordenoMessage);
		// 	});
		// }
		this.client.addEvent('messageCreate');
		this.client.on('messageCreate', (message) => {
			return this.handleCommand(message as DiscordenoMessage);
		});
	}
	async commandChecks(
		command: NaticoCommand,
		message: DiscordenoMessage,
		args: string | undefined
	) {
		if (this.inhibitorHandler) {
			if (await this.inhibitorHandler.runChecks(message, command)) return true;
		}
		const authorId = message.authorId.toString();
		if (!this.superusers.includes(authorId)) {
			if (!command.enabled) {
				if (!this.superusers.includes(authorId)) {
					this.emit('disabled', message, command, args);
					return true;
				}
			}

			if (this.cooldowns.has(authorId)) {
				if (!this.IgnoreCD.includes(authorId)) {
					this.emit('cooldownBlocked', message, command, args);
					return true;
				}
			}

			if (this.guildonly) {
				if (!message.guildId) {
					this.emit('guildOnly', message, command, args);
					return true;
				}
			}

			if (command.required) {
				if (!args) {
					this.emit('required', message, command);
					return true;
				}
			}

			if (command.permissions) {
				if (
					!hasGuildPermissions(
						message!.guildId,
						message.authorId,
						command.permissions
					)
				) {
					this.emit('userPermissions', message, command, args);
					return true;
				}
			}
		}
		if (command.ownerOnly) {
			if (!this.owners.includes(authorId)) {
				this.emit('ownerOnly', message, command, args);
				return true;
			}
		}

		if (command.superUserOnly) {
			if (!this.superusers.includes(authorId)) {
				this.emit('superUserOnly', message, command, args);
				return true;
			}
		}
		return false;
	}
	/**
	 *
	 * @param command - Command that gets executed
	 * @param message - Message object to be passed through
	 * @param args - arguments to be passed though
	 * @returns - What the ran command returned
	 */
	public async runCommand(
		command: NaticoCommand,
		message: DiscordenoMessage,
		args?: string
	) {
		if (await this.commandChecks(command, message, args)) return false;

		try {
			const data = this.generateArgs(command, args);
			this.emit('commandStarted', message, command, data);
			await command.exec(message, data);
			this.emit('commandEnded', message, command, data);
			/**
			 * Adding the user to a set and deleting them later!
			 */
			this.cooldowns.add(message.authorId.toString());
			setTimeout(
				() => this.cooldowns.delete(message.authorId.toString()),
				this.cooldown
			);
		} catch (e: unknown) {
			this.emit('commandError', message, command, e);
		}
	}
	generateArgs(command: NaticoCommand, content: string | undefined) {
		const args: ConvertedOptions = {};
		if (command.options) {
			for (const option of command.options) {
				if (option?.name !== undefined) {
					//@ts-ignoreansjkdfankjjksdf
					args[option.name] = content;
				}
			}
		}
		return args;
	}

	public async handleCommand(message: DiscordenoMessage) {
		if (!message?.content) return;
		if (message.isBot) return;

		/**
		 * Allowing pings to be used as prefix!
		 */
		if (message.content.startsWith(`<@!${this.client.id}>`)) {
			console.log('Command found w mention');
			const command = message.content
				.toLowerCase()
				.slice(`<@!${this.client.id}>`.length)
				.trim()
				.split(' ')[0];
			const Command = this.findCommand(command);

			if (Command) {
				const args = message.content
					.slice(`<@!${this.client.id}>`.length)
					.trim()
					.slice(command.length)
					.trim();

				return this.runCommand(Command, message, args);
			}
		}
		let prefixes;
		if (typeof this.prefix == 'function') prefixes = await this.prefix(message);
		else prefixes = this.prefix;
		if (Array.isArray(prefixes)) {
			for (const prefix of prefixes) {
				if (await this.prefixCheck(prefix, message)) return;
			}
		} else {
			return this.prefixCheck(prefixes, message);
		}
	}
	async prefixCheck(prefix: string, message: DiscordenoMessage) {
		if (message.content.toLowerCase().startsWith(prefix)) {
			const command = message.content
				.toLowerCase()
				.slice(prefix.length)
				.trim()
				.split(' ')[0];
			const Command = this.findCommand(command);
			if (Command) {
				const args = message.content
					.slice(prefix.length)
					.trim()
					.slice(command.length)
					.trim();
				await this.runCommand(Command, message, args);
				return true;
			}
		}
	}
	/**
	 * Simple function to find a command could be useful outside of the handler
	 * @param command - Command you want to search for
	 * @returns Command object or undefined
	 */
	public findCommand(command: string | undefined): NaticoCommand | undefined {
		return this.modules.find((cmd) => {
			if (cmd.name == command) {
				return true;
			}
			if (cmd.aliases) {
				if (cmd.aliases.includes(<string>command)) {
					return true;
				}
			}
			return false;
		});
	}
	/**
	 * Check if commands have slash data and if they do it will activete it
	 * be carefull to no accidentally enable them globally,
	 * first searches if the command is already enabled and if it changed since and edit it accordingly otherwise creates a command
	 * also deletes unused slash commands
	 * @param guildID - Specific guild to enable slash commands on
	 * @returns - List of enabled commands
	 */
	async enableSlash(guildID?: bigint) {
		const slashed = this.slashed();
		await upsertSlashCommands(slashed, guildID);
		return slashed;
	}
	slashed() {
		const commands: EditGlobalApplicationCommand[] = [];
		const data = this.modules.filter(
			(command) => (command.enabled && command.slash) || false
		);
		data.forEach((command: naticoCommand) => {
			const slashdata: EditGlobalApplicationCommand = {
				name: command.name || command.id,
				description: command.description || 'no description',
			};
			//@ts-ignore - types are a lie
			if (command.options) slashdata['options'] = command.options;
			commands.push(slashdata);
		});
		return commands;
	}
	handleSlashCommand(interaction) {
		let args: ConvertedOptions = {};
		for (const option of interaction.data?.options) {
			if (option?.value) {
				args[option.name] = option.value;
			}
		}
	}
	setInhibitorHandler(inhibitorHandler: NaticoInhibitorHandler) {
		this.inhibitorHandler = inhibitorHandler;
	}
}
