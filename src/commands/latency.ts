import type { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
export class Example {
  @Slash({
    description: "Luh Geeky leak drop delay",
    name: "latency",
  })
  async latency(interaction: CommandInteraction): Promise<void> {
    await interaction.reply({
      content: `Luh Geeky leak drop delay is \`${interaction.client.ws.ping}ms\``,
      ephemeral: true,
    });
  }
}
