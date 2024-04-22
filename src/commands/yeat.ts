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
    description: "Shows Luh Geeky's stats",
    name: "yeat",
  })
  async yeat(interaction: CommandInteraction): Promise<void> {
    const YEAT_ID = "3qiHUAX7zY4Qnjx8TNUzVx";
    const ARTIST_URL = `https://api.spotify.com/v1/artists/${YEAT_ID}`;

    const artist = (await (
      await fetch(ARTIST_URL, {
        headers: {
          Authorization: `Bearer ${process.env.SPOTIFY_ACCESS_TOKEN}`,
        },
      })
    ).json()) as Artist;

    const embed = new EmbedBuilder({
      color: 0x000000,
      url: "",
      author: {
        name: artist.name,
        iconURL: artist.images[0].url,
        url: artist.external_urls.spotify,
      },

      fields: [
        {
          name: "Popularity",
          value: artist.popularity.toString(),
        },
        {
          name: "Genres",
          value: artist.genres.join(", "),
        },
        {
          name: "Followers",
          value: artist.followers.total.toString(),
        },
      ],

      image: {
        url: artist.images[0].url,
      },
    });

    await interaction.reply({
      embeds: [embed],
    });
  }
}
