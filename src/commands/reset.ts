import { PrismaClient } from "@prisma/client";
import type { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import ImageKit from "imagekit";

@Discord()
export class Example {
  @Slash({
    description: "Brainwash Luh Geeky (Owner only)",
    name: "reset",
    guilds: ["1222698648907813025"],
  })
  async cleanup(interaction: CommandInteraction): Promise<void> {
    // @ts-ignore
    const ownerId = (await interaction.client.application.fetch()).owner.id;

    if (interaction.user.id != ownerId) {
      await interaction.reply({
        content: "You can't use this",
        ephemeral: true,
      });

      return;
    }

    const imagekit = new ImageKit({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT as string,
    });

    try {
      // Delete all config at once
      await imagekit.deleteFolder("yeat");

      // Delete database aswell
      const prisma = new PrismaClient();

      await prisma.guilds.deleteMany({});

      await prisma.$disconnect();

      await interaction.reply({
        content: "Bot reset.",
        ephemeral: true,
      });
    } catch (e) {
      await interaction.reply({
        content: "Nothing to reset.",
        ephemeral: true,
      });
    }
  }
}
