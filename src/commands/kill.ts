import type { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
export class Example {
  @Slash({
    description: "Kills Luh Geeky (Owner only)",
    name: "kill",
    guilds: [process.env.OWNER_GUILD_ID],
  })
  async kill(interaction: CommandInteraction): Promise<void> {
    const ownerId = (await interaction.client.application.fetch()).owner.id;

    if (interaction.user.id != ownerId) {
      await interaction.reply({
        content: "You can't use this",
        ephemeral: true,
      });

      return;
    }

    await interaction.reply({
      content: `Luh Geeky out`,
      ephemeral: true,
    });

    process.exit(0);
  }
}
