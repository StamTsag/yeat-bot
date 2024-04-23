import type { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
export class Example {
  @Slash({
    description: "Luh Geeky uptime",
    name: "uptime",
  })
  async uptime(interaction: CommandInteraction): Promise<void> {
    function uptimeToFormatted() {
      const ms = interaction.client.uptime;

      let seconds = Math.round(ms / 1000);
      let minutes = Math.round(ms / (1000 * 60));
      let hours = Math.round(ms / (1000 * 60 * 60));
      let days = Math.round(ms / (1000 * 60 * 60 * 24));

      if (seconds < 60) return `${seconds} second${seconds != 1 ? "s" : ""}`;
      else if (minutes < 60)
        return `${minutes} minute${minutes != 1 ? "s" : ""}`;
      else if (hours < 24) return `${hours} hour${hours != 1 ? "s" : ""} `;
      else return `${days} day${days != 1 ? "s" : ""}`;
    }

    await interaction.reply({
      content: `Luh Geeky uptime is \`${uptimeToFormatted()}\``,
      ephemeral: true,
    });
  }
}
