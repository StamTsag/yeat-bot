import type { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
export class Example {
  @Slash({
    description: "Invite Yeat aka Luh Geeky",
    name: "invite",
  })
  async invite(interaction: CommandInteraction): Promise<void> {
    await interaction.reply({
      content: `Invite [Yeat aka Luh Geeky](${process.env.INVITE_URL})`,
      ephemeral: true,
    });
  }
}
