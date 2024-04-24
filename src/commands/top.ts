import { EmbedBuilder, type CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import { Artist, Track } from "../interfaces";

@Discord()
export class Example {
  @Slash({
    description: "Shows Luh Geeky's top tracks",
    name: "top",
  })
  async top(interaction: CommandInteraction): Promise<void> {
    const YEAT_ID = "3qiHUAX7zY4Qnjx8TNUzVx";
    const TOP_URL = `https://api.spotify.com/v1/artists/${YEAT_ID}/top-tracks`;
    const ARTIST_URL = `https://api.spotify.com/v1/artists/${YEAT_ID}`;

    const artist = (await (
      await fetch(ARTIST_URL, {
        headers: {
          Authorization: `Bearer ${process.env.SPOTIFY_ACCESS_TOKEN}`,
        },
      })
    ).json()) as Artist;

    const topTracks = (
      await (
        await fetch(TOP_URL, {
          headers: {
            Authorization: `Bearer ${process.env.SPOTIFY_ACCESS_TOKEN}`,
          },
        })
      ).json()
    ).tracks as Track[];

    const embed = new EmbedBuilder({
      color: 0x000000,
      author: {
        name: artist.name,
        iconURL: artist.images[0].url,
        url: artist.external_urls.spotify,
      },
    });

    for (let i = 0; i < 5; i++) {
      const track = topTracks[i];

      embed.addFields([
        {
          name: track.name,
          value: `Popularity: ${track.popularity}`,
        },
      ]);
    }

    await interaction.reply({
      embeds: [embed],
    });
  }
}
