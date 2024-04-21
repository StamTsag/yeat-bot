import type { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import qrcode from "qrcode";
import ImageKit from "imagekit";
import { v4 } from "uuid";

@Discord()
export class Example {
  @Slash({ description: "Luh Geeky will cook up a QR code", name: "qr" })
  async qr(
    @SlashOption({
      description: "QR code text",
      name: "text",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    text: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const imagekit = new ImageKit({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT as string,
    });

    const uploaded = await imagekit.upload({
      file: await qrcode.toDataURL(text),
      folder: "yeat/qrs",
      fileName: `${v4()}.png`,
      useUniqueFileName: false,
    });

    interaction.reply({
      files: [uploaded.url],
    });
  }
}
