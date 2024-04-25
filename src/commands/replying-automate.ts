import type { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import { prisma } from "vars";

@Discord()
export class Example {
  @Slash({
    description: "Luh Geeky sends a text every 30 minutes (Server owner only)",
    name: "automate-replying",
  })
  async replyingAutomate(interaction: CommandInteraction): Promise<void> {
    const ownerId = (await interaction.client.application.fetch()).owner.id;
    const guildOwner = interaction.guild.ownerId;
    const guildId = interaction.guild.id;

    // Must be bot / guild owner
    if (interaction.user.id != ownerId && interaction.user.id != guildOwner) {
      await interaction.reply({
        content:
          "My twizzy you must contact the server owner to toggle this feature.",
        ephemeral: true,
      });

      return;
    }

    let guild = await prisma.guilds.findUnique({
      where: {
        guildId,
      },

      select: {
        logging: true,
        prompts: true,
        automated: true,
      },
    });

    // Create if not found
    if (!guild || !guild.logging || guild.prompts.length == 0) {
      await interaction.reply({
        content: "Luh Geeky aint even replying to yall lol",
      });

      return;
    }

    // Toggle automation
    const newAutomation = !guild.automated;

    await prisma.guilds.update({
      where: {
        guildId,
      },

      data: {
        automated: newAutomation,
        automationChannel: interaction.channel.id,
      },
    });

    if (newAutomation) {
      await interaction.reply("Luh Geeky will spam yall every 30 minutes");
    } else {
      await interaction.reply("Luh Geeky will shush now");
    }
  }
}
