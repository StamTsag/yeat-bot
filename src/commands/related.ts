import { EmbedBuilder, type CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";

interface Artist {
  external_urls: {
    spotify: string;
  };

  followers: {
    total: number;
  };

  genres: string[];
  href: string;
  id: string;

  images: {
    url: string;
    height: number;
    width: number;
  }[];

  name: string;
  popularity: number;
}

@Discord()
export class Example {
  @Slash({
    description: "Shows Luh Geeky's related artists",
    name: "related",
  })
  async related(interaction: CommandInteraction): Promise<void> {
    const YEAT_ID = "3qiHUAX7zY4Qnjx8TNUzVx";
    const RELATED_URL = `https://api.spotify.com/v1/artists/${YEAT_ID}/related-artists`;
    const ARTIST_URL = `https://api.spotify.com/v1/artists/${YEAT_ID}`;

    const artist = (await (
      await fetch(ARTIST_URL, {
        headers: {
          Authorization: `Bearer ${process.env.SPOTIFY_ACCESS_TOKEN}`,
        },
      })
    ).json()) as Artist;

    const related = (
      await (
        await fetch(RELATED_URL, {
          headers: {
            Authorization: `Bearer ${process.env.SPOTIFY_ACCESS_TOKEN}`,
          },
        })
      ).json()
    ).artists as Artist[];

    const embed = new EmbedBuilder({
      color: 0x000000,
      url: "",
      author: {
        name: artist.name,
        iconURL: artist.images[0].url,
        url: artist.external_urls.spotify,
      },
    });

    for (let i = 0; i < 5; i++) {
      const artist = related[i];

      embed.addFields([
        {
          name: artist.name,
          value: `Popularity: ${artist.popularity}`,
        },
      ]);
    }

    await interaction.reply({
      embeds: [embed],
    });
  }
}
