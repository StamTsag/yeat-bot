import { PrismaClient } from "@prisma/client";
import type { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
export class Example {
  @Slash({
    description: "Enables/Disables Luh Geeky replying based on chat history",
    name: "replying",
  })
  async replying(interaction: CommandInteraction): Promise<void> {
    const guildId = interaction.guild.id;
    const prisma = new PrismaClient();

    const guild = await prisma.guilds.findUnique({
      where: {
        guildId,
      },

      select: {
        logging: true,
      },
    });

    // Create if not found
    if (!guild) {
      await prisma.guilds.create({
        data: {
          guildId,
        },
      });
    }

    // Toggle logging
    const newLogging = !guild.logging;

    await prisma.guilds.update({
      where: {
        guildId,
      },

      data: {
        logging: newLogging,
      },
    });

    process.env.RERUN_CHECKS_FOR = guildId;

    await prisma.$disconnect();

    if (newLogging) {
      await interaction.reply("Luh Geeky will now reply to yall");
    } else {
      await interaction.reply("Luh Geeky will ignore yall now");
    }
  }
}
