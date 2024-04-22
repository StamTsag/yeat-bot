import type { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
export class Example {
  @Slash({
    description: "Shows Luh Geeky era",
    name: "version",
  })
  async version(interaction: CommandInteraction): Promise<void> {
    await interaction.reply({
      content: `We in era \`${process.env.npm_package_version}\``,
      ephemeral: true,
    });
  }
}
