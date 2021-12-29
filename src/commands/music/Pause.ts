import { MessageEmbed } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
    name: "pause",
    description: "Pauses current song.",
    run: async ({ interaction, player }) => {
        if (!interaction.member.voice.channel)
            return interaction.followUp({
                embeds: [
                    new MessageEmbed()
                        .setColor("RANDOM")
                        .addField("Error", "You have to be in voice channel!"),
                ],
                ephemeral: true,
            });

        if (
            interaction.member.voice.channel.id !==
            interaction.guild?.me?.voice.channel?.id
        )
            return interaction.followUp({
                embeds: [
                    new MessageEmbed()
                        .setColor("RANDOM")
                        .addField(
                            "Error",
                            "You have to be in the same voice channel as me!"
                        ),
                ],
                ephemeral: true,
            });

        const queue = player.getQueue(interaction.guild);

        if (!queue.playing)
            return interaction.followUp({
                embeds: [
                    new MessageEmbed()
                        .setColor("RANDOM")
                        .addField(
                            "Error",
                            "No music is currently being played!"
                        ),
                ],
                ephemeral: true,
            });

        queue.setPaused(true);

        interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setColor("RANDOM")
                    .addField(
                        "Pause",
                        `Song [**${queue.current.title}**](${queue.current.url})has been paused.`
                    )
                    .setFooter({
                        text: `Paused by \`${interaction.user.tag}\``,
                    })
                    .setTimestamp()
                    .setThumbnail(queue.current.thumbnail),
            ],
        });
    },
});
