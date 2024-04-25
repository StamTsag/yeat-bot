import type { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import { prisma } from "vars";

@Discord()
export class Example {
  @Slash({
    description: "Resets Luh Geeky replying data (Server owner only)",
    name: "reset-replying",
  })
  async kill(interaction: CommandInteraction): Promise<void> {
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
      },
    });

    // Create if not found
    if (!guild || !guild.logging || guild.prompts.length == 0) {
      await interaction.reply({
        content: "Luh Geeky got no data for your server",
        ephemeral: true,
      });

      return;
    }

    await prisma.guilds.update({
      where: {
        guildId,
      },

      data: {
        prompts: {
          set: [
            "luh",
            "geeky",
            "https://tenor.com/view/yeat-skibidi-skibidi-yeat-yeat-skibity-skibidi-toilet-gif-13661983242605751936",
            "ong",
            "twizzy",
            "cap",
          ],
        },
      },
    });

    await interaction.reply("Luh Geeky forgot about yall's chat history");
  }
}
