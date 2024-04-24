import { EmbedBuilder, type CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import { Album, Artist } from "../interfaces";

@Discord()
export class Example {
  @Slash({
    description: "Shows Luh Geeky's albums",
    name: "albums",
  })
  async albums(interaction: CommandInteraction): Promise<void> {
    const YEAT_ID = "3qiHUAX7zY4Qnjx8TNUzVx";
    const ALBUMS_URL = `https://api.spotify.com/v1/artists/${YEAT_ID}/albums?include_groups=album`;
    const ARTIST_URL = `https://api.spotify.com/v1/artists/${YEAT_ID}`;

    const artist = (await (
      await fetch(ARTIST_URL, {
        headers: {
          Authorization: `Bearer ${process.env.SPOTIFY_ACCESS_TOKEN}`,
        },
      })
    ).json()) as Artist;

    const albums = (
      await (
        await fetch(ALBUMS_URL, {
          headers: {
            Authorization: `Bearer ${process.env.SPOTIFY_ACCESS_TOKEN}`,
          },
        })
      ).json()
    ).items as Album[];

    const embed = new EmbedBuilder({
      color: 0x000000,
      author: {
        name: artist.name,
        iconURL: artist.images[0].url,
        url: artist.external_urls.spotify,
      },
    });

    for (const album of albums) {
      embed.addFields([
        {
          name: album.name,
          value: `${album.total_tracks} tracks | ${album.release_date}`,
        },
      ]);
    }

    await interaction.reply({
      embeds: [embed],
    });
  }
}
