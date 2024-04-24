import type { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import ImageKit from "imagekit";
import { prisma } from "../vars";
import { resetLoggingIds } from "main";

@Discord()
export class Example {
  @Slash({
    description: "Brainwash Luh Geeky (Owner only)",
    name: "reset",
    guilds: [process.env.OWNER_GUILD_ID],
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
    } catch (e) {
      // empty folder
    }

    // Delete database aswell
    await prisma.guilds.deleteMany({});

    resetLoggingIds();

    await interaction.reply({
      content: "Bot reset.",
      ephemeral: true,
    });
  }
}
