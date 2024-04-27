import type { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import { toggleMentionId } from "main";
import { prisma } from "vars";

@Discord()
export class Example {
  @Slash({
    description:
      "Toggles Luh Geeky replying only on mentions (Server owner only)",
    name: "mention-replying",
  })
  async replyingMention(interaction: CommandInteraction): Promise<void> {
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
        mentionOnly: true,
      },
    });

    if (!guild || !guild.logging) {
      await interaction.reply({
        content: "Luh Geeky aint even replying to yall lol",
      });

      return;
    }

    // Toggle automation
    const newMentionOnly = !guild.mentionOnly;

    await prisma.guilds.update({
      where: {
        guildId,
      },

      data: {
        mentionOnly: newMentionOnly,
      },
    });

    toggleMentionId(guildId);

    if (newMentionOnly) {
      await interaction.reply("Luh Geeky will only reply to mentions now");
    } else {
      await interaction.reply(
        "Luh Geeky will reply to everything per chance now"
      );
    }
  }
}
