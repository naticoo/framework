export enum CommandHandlerEvents {
  /** Message-Command-args */
  COOLDOWN = "cooldownBlocked",
  /** Message-Command-args */
  GUILDONLY = "guildOnly",
  /** Message-Command-args */
  USERPERMISSIONS = "userPermissions",
  /** Message-Command-args */
  CLIENTPERMISSIONS = "clientPermissions",
  /** Message-Command-args */
  OWNERONLY = "owerOnly",
  /** Message-Command-args */
  SUPERUSERRONLY = "superUserOnly",
  /** Message-Command-args */
  COMMANDSTARTED = "commandStarted",
  /** Message-Command-args-commandResponse */
  COMMANDENDED = "commandEnded",
  /** Message-Command-error */
  COMMANDERROR = "commandError",
}
export enum TaskHandlerEvents {
  /** task - error */
  TASKERROR = "taskError",
}
export enum ListenerHandlerEvents {
  /** task - error */
  LISTENERERROR = "ListenerError",
}
