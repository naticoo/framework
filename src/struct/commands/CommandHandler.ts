import {
  ApplicationCommandOption,
  Collection,
  DiscordApplicationCommandOptionTypes,
  DiscordenoMessage,
  EditGlobalApplicationCommand,
  hasGuildPermissions,
  upsertSlashCommands,
  botId,
  getMissingGuildPermissions,
} from "../../../deps.ts";
import { NaticoClient } from "../NaticoClient.ts";
import { ArgumentGenerator } from "./ArgumentGenerator.ts";
import { NaticoInhibitorHandler } from "../inhibitors/InhibitorHandler.ts";
import { NaticoCommand } from "./Command.ts";
import { NaticoSubCommand } from "./SubCommand.ts";
import { NaticoHandler } from "../NaticoHandler.ts";
import { ConvertedOptions, prefixFn, ArgOptions } from "../../util/Interfaces.ts";
import { CommandHandlerEvents } from "../../util/Constants.ts";
export class NaticoCommandHandler extends NaticoHandler {
  modules: Collection<string, NaticoCommand | NaticoSubCommand>;
  cooldowns: Set<string>;
  IgnoreCD: string[];
  owners: string[];
  cooldown: number;
  superusers: string[];
  guildonly: boolean;
  prefix: prefixFn | string | string[];
  handleEdits: boolean;
  inhibitorHandler!: NaticoInhibitorHandler;
  generator: ArgumentGenerator;
  /**
   * Single means all subcommands in the same file; multiple means in every file
   */
  subType: "single" | "multiple";
  // handleSlashes: boolean;
  constructor(
    client: NaticoClient,
    {
      directory = "./commands",
      prefix = "!",
      IgnoreCD = [],
      owners = [],
      cooldown = 5000,
      superusers = [],
      guildonly = false,
      handleEdits = false,
      subType = "single",
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
      /**
       * Single means all subcommands in the same file; multiple means in every file
       */
      subType?: "single" | "multiple";
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
    this.generator = new ArgumentGenerator(this.client);
    this.subType = subType;
    this.start();
  }
  start() {
    if (this.handleEdits) {
      this.client.addEvent("messageUpdate");
      this.client.on("messageUpdate", (message) => {
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
    this.client.addEvent("messageCreate");
    this.client.on("messageCreate", (message) => {
      return this.handleCommand(message as DiscordenoMessage);
    });
  }
  async commandChecks(command: NaticoCommand, message: DiscordenoMessage, args: string | undefined) {
    if (this.inhibitorHandler) {
      if (await this.inhibitorHandler.runChecks(message, command)) return true;
    }

    const authorId = message.authorId.toString();
    if (!this.superusers.includes(authorId)) {
      //Otherwise you would get on cooldown
      if (command instanceof NaticoSubCommand == false)
        if (this.cooldowns.has(authorId)) {
          if (!this.IgnoreCD.includes(authorId)) {
            this.emit(CommandHandlerEvents.COOLDOWN, message, command, args);
            return true;
          }
        }

      if (this.guildonly) {
        if (!message.guildId) {
          this.emit(CommandHandlerEvents.GUILDONLY, message, command, args);
          return true;
        }
      }

      if (command.userPermissions) {
        const missingPermissions = await getMissingGuildPermissions(
          message!.guildId,
          message.authorId,
          command.userPermissions
        );
        if (missingPermissions[0]) {
          this.emit(CommandHandlerEvents.USERPERMISSIONS, message, command, args, missingPermissions);
          return true;
        }
      }
      if (command.clientPermissions) {
        const missingPermissions = await getMissingGuildPermissions(message!.guildId, botId, command.clientPermissions);
        if (missingPermissions[0]) {
          this.emit(CommandHandlerEvents.CLIENTPERMISSIONS, message, command, args, missingPermissions);
          return true;
        }
      }
    }
    if (command.ownerOnly) {
      if (!this.owners.includes(authorId)) {
        this.emit(CommandHandlerEvents.OWNERONLY, message, command, args);
        return true;
      }
    }

    if (command.superUserOnly) {
      if (!this.superusers.includes(authorId)) {
        this.emit(CommandHandlerEvents.SUPERUSERRONLY, message, command, args);
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
  public async runCommand(command: NaticoCommand, message: DiscordenoMessage, args?: string) {
    if (await this.commandChecks(command, message, args)) return false;

    try {
      let sub: string | null = null;
      let savedOptions: ArgOptions[] | undefined = undefined;
      if (command?.options && args) {
        if (command?.options[0]?.type == DiscordApplicationCommandOptionTypes.SubCommand) {
          //Thing needs to be defined to not cause mutation
          const thing = args.split(" ")[0].toLowerCase();

          for (const option of command.options) {
            if (option.name === thing) {
              if (this.subType == "multiple") {
                args = args.split(" ").slice(1).join(" ");
                sub = option.name;
                savedOptions = command.options as ArgOptions[];
                command.options = option.options;
              } else {
                const mod = this.modules.find((mod) => {
                  if (mod instanceof NaticoSubCommand && mod.subOf == command.name && mod.name == option.name) {
                    return true;
                  }
                  return false;
                });
                if (mod) {
                  this.runCommand(mod, message, args.split(" ").slice(1).join(" "));
                  return;
                }
              }
            }
          }
        }
      }
      const data = await this.generator.handleArgs(command, message, args);

      if (savedOptions) command.options = savedOptions;

      this.emit("commandStarted", message, command, data);

      const res = sub
        ? //@ts-ignore -
          await command[sub](message, data)
        : await command.exec(message, data);
      this.emit("commandEnded", message, command, data, res);
      /**
       * Adding the user to a set and deleting them later!
       */
      this.cooldowns.add(message.authorId.toString());
      setTimeout(() => this.cooldowns.delete(message.authorId.toString()), this.cooldown);
    } catch (e: unknown) {
      this.emit("commandError", message, command, e);
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
      const command = message.content.toLowerCase().slice(`<@!${this.client.id}>`.length).trim().split(" ")[0];
      const Command = this.findCommand(command);

      if (Command) {
        const args = message.content.slice(`<@!${this.client.id}>`.length).trim().slice(command.length).trim();

        return this.runCommand(Command, message, args);
      }
    }
    let prefixes;
    if (typeof this.prefix == "function") prefixes = await this.prefix(message);
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
      const command = message.content.toLowerCase().slice(prefix.length).trim().split(" ")[0];
      const Command = this.findCommand(command);
      if (Command) {
        const args = message.content.slice(prefix.length).trim().slice(command.length).trim();
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
      if (cmd instanceof NaticoSubCommand) return false;
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
    const data = this.modules.filter((command) => (command.enabled && command.slash) || false);
    data.forEach((command: NaticoCommand) => {
      const slashdata: EditGlobalApplicationCommand = {
        name: command.name || command.id,
        description: command.description || "no description",
      };
      const options: ApplicationCommandOption[] = [];
      if (command.options) {
        command.options.forEach((option) => {
          delete option["match"];
          delete option["customType"];
          options.push(option);
        });
      }
      if (command.options) slashdata["options"] = options;
      commands.push(slashdata);
    });
    return commands;
  }
  handleSlashCommand(interaction: any) {
    const args: ConvertedOptions = {};
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
