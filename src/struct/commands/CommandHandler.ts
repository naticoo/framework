import {
  ApplicationCommandOption,
  Collection,
  DiscordApplicationCommandOptionTypes,
  DiscordenoMessage,
  EditGlobalApplicationCommand,
  upsertSlashCommands,
  botId,
  getMissingChannelPermissions,
  DiscordInteractionTypes,
  SlashCommandInteraction,
} from "../../../deps.ts";
import { NaticoCommandUtil } from "./commandUtil.ts";
import { NaticoClient } from "../NaticoClient.ts";
import { ArgumentGenerator } from "./ArgumentGenerator.ts";
import { NaticoInhibitorHandler } from "../inhibitors/InhibitorHandler.ts";
import { NaticoCommand } from "./Command.ts";
import { NaticoSubCommand } from "./SubCommand.ts";
import { NaticoHandler } from "../NaticoHandler.js";
import { ConvertedOptions, prefixFn, ArgOptions } from "../../util/Interfaces.ts";
import { CommandHandlerEvents } from "../../util/Constants.ts";
import { createNaticoInteraction } from "../../util/createNaticoInteraction.ts";
export interface NaticoCommandHandlerOptions {
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
  commandUtil?: boolean;
  storeMessages?: boolean;
  mentionPrefix?: boolean;
  handleSlashCommands?: boolean;
  // handleSlashes?: boolean;
}
export class NaticoCommandHandler extends NaticoHandler {
  declare modules: Collection<string, NaticoCommand | NaticoSubCommand>;
  commandUtils: Collection<BigInt, NaticoCommandUtil>;
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
  commandUtil: boolean;
  storeMessages: boolean;
  mentionPrefix: boolean;
  handleSlashCommands: boolean;
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
      commandUtil = true,
      storeMessages = true,
      mentionPrefix = true,
      handleSlashCommands = false,
    }: NaticoCommandHandlerOptions
  ) {
    super(client, {
      directory,
    });
    this.handleSlashCommands = handleSlashCommands;
    this.commandUtil = commandUtil;
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
    this.commandUtils = new Collection();
    this.storeMessages = storeMessages;
    this.mentionPrefix = mentionPrefix;
    this.start();
  }
  start() {
    if (this.handleEdits) {
      this.client.addEvent("messageUpdate");
      this.client.on("messageUpdate", (message: DiscordenoMessage) => {
        return this.handleCommand(message);
      });
    }
    if (this.handleSlashCommands) {
      this.client.addEvent("interactionCreate");
      this.client.on("interactionCreate", async (data: SlashCommandInteraction) => {
        if (data.type === DiscordInteractionTypes.ApplicationCommand)
          return this.handleSlashCommand(await createNaticoInteraction(data, this));
      });
    }
    this.client.addEvent("messageCreate");
    this.client.on("messageCreate", (message: DiscordenoMessage) => {
      return this.handleCommand(message);
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
        const missingPermissions = await getMissingChannelPermissions(
          message!.channelId,
          message.authorId,
          command.userPermissions
        );
        if (missingPermissions[0]) {
          this.emit(CommandHandlerEvents.USERPERMISSIONS, message, command, args, missingPermissions);
          return true;
        }
      }
      if (command.clientPermissions) {
        const missingPermissions = await getMissingChannelPermissions(
          message!.channelId,
          botId,
          command.clientPermissions
        );
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

  public async handleCommand(message: DiscordenoMessage) {
    if (!message?.content) return;
    if (message.isBot) return;

    const prefixes = typeof this.prefix == "function" ? await this.prefix(message) : this.prefix;
    const parsedPrefixes = [];

    if (Array.isArray(prefixes)) parsedPrefixes.push(...prefixes);
    else parsedPrefixes.push(prefixes);
    if (this.mentionPrefix) parsedPrefixes.push(`<@!${botId}>`, `<@${botId}>`);

    for (const prefix of parsedPrefixes) {
      if (await this.prefixCheck(prefix, message)) return;
    }
  }
  async prefixCheck(prefix: string, message: DiscordenoMessage) {
    if (message.content.toLowerCase().startsWith(prefix)) {
      const commandName = message.content.toLowerCase().slice(prefix.length).trim().split(" ")[0];
      const command = this.findCommand(commandName);
      if (command) {
        if (this.commandUtil) {
          if (this.commandUtils.has(message.id)) {
            message.util = this.commandUtils.get(message.id)!;
          } else {
            message.util = new NaticoCommandUtil(this, message);
            this.commandUtils.set(message.id, message.util);
          }
        }
        message.util?.setParsed({ prefix, alias: commandName });
        const args = message.content.slice(prefix.length).trim().slice(commandName.length).trim();
        await this.runCommand(command, message, args);
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
    const data = this.modules.filter((command) => command.slash || false);
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
  async handleSlashCommand(interaction: any) {
    const args: ConvertedOptions = {};
    if (interaction.util.data.interaction?.data?.options)
      for (const option of interaction.util.data.interaction.data?.options) {
        if (option?.value) {
          args[option.name] = option.value;
        }
      }
    const command = this.findCommand(interaction.util.data.interaction.data.name);
    if (!command) return;
    let sub: string | null = null;
    if (command?.options) {
      if (command?.options[0]?.type == DiscordApplicationCommandOptionTypes.SubCommand) {
        sub = interaction.util.data.interaction.data?.options[0].name;
        if (interaction.util.data.interaction?.data?.options[0]?.options)
          for (const option of interaction.util.data.interaction.data?.options[0]?.options) {
            if (option?.value) {
              args[option.name] = option.value;
            }
          }
        for (const option of command.options) {
          if (option.name === sub) {
            if (this.subType == "multiple") {
              command.options = option.options;
            } else {
              const mod = this.modules.find((mod) => {
                if (mod instanceof NaticoSubCommand && mod.subOf == command.name && mod.name == option.name) {
                  return true;
                }
                return false;
              });
              if (mod) {
                try {
                  this.emit("commandStarted", interaction, command, args);
                  const res = await mod.exec(interaction, args);
                  this.emit("commandEnded", interaction, command, args, res);
                  return;
                } catch (e) {
                  this.emit("commandError", interaction, command, e);
                }
              }
            }
          }
        }
      }
    }
    try {
      this.emit("commandStarted", interaction, command, args);
      //@ts-ignore -
      const res = sub ? await command[sub](interaction, args) : await command.exec(interaction, args);
      this.emit("commandEnded", interaction, command, args, res);
    } catch (e) {
      this.emit("commandError", interaction, command, e);
    }

    /**
     * Adding the user to a set and deleting them later!
     */
    this.cooldowns.add(interaction.authorId.toString());
    setTimeout(() => this.cooldowns.delete(interaction.authorId.toString()), this.cooldown);
  }
  setInhibitorHandler(inhibitorHandler: NaticoInhibitorHandler) {
    this.inhibitorHandler = inhibitorHandler;
  }
}
