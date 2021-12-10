// Source: 2021 Discordeno - https://github.com/discordeno/template/blob/48165243c6053fb9568c8df4fc25fd1273a92c11/src/utils/Components.ts
import { ActionRow, ButtonStyles } from "../../deps.ts";

const snowflakeRegex = /[0-9]{17,19}/;
//Prefixes with Natico to not cause type errors
export class NaticoComponents extends Array<ActionRow> {
  constructor(...args: ActionRow[]) {
    super(...args);

    return this;
  }

  addActionRow() {
    // Don't allow more than 5 Action Rows
    if (this.length === 5) return this;

    this.push({
      type: 1,
      components: [] as unknown as ActionRow["components"],
    });
    return this;
  }

  addButton(
    label: string,
    style: keyof typeof ButtonStyles,
    idOrLink: string,
    options?: { emoji?: string | bigint; disabled?: boolean }
  ) {
    // No Action Row has been created so do it
    if (!this.length) this.addActionRow();

    // Get the last Action Row
    let row = this[this.length - 1];

    // If the Action Row already has 5 buttons create a new one
    if (row.components.length === 5) {
      this.addActionRow();
      row = this[this.length - 1];

      // Apperandly there are already 5 Full Action Rows so don't add the button
      if (row.components.length === 5) return this;
    }

    row.components.push({
      type: DiscordMessageComponentTypes.Button,
      label: label,
      customId: style !== "Link" ? idOrLink : undefined,
      style: ButtonStyles[style],
      emoji: this.#stringToEmoji(options?.emoji),
      url: style === "Link" ? idOrLink : undefined,
      disabled: options?.disabled,
    });
    return this;
  }

  #stringToEmoji(emoji?: string | bigint) {
    if (!emoji) return;

    emoji = emoji.toString();

    // A snowflake id was provided
    if (snowflakeRegex.test(emoji)) {
      return {
        id: emoji.match(snowflakeRegex)![0],
      };
    }

    // A unicode emoji was provided
    return {
      name: emoji,
    };
  }
}
