import { Command } from '../../structures/Command';
import { MessageEmbed } from 'discord.js';
import Player from '../../structures/Player'

export default new Command({
    name:'skip',
    description: 'Skips current song',
    run: async ({interaction}) => {
        if (!interaction.member.voice.channel) 
            return interaction.followUp({
                embeds: [
                    new MessageEmbed()
                    .setColor('RANDOM')
                    .addField('Error', 'You have to be in voice channel!')
                ],
                ephemeral: true
            });

        if (interaction.member.voice.channel.id !== interaction.guild?.me?.voice.channel?.id) 
            return interaction.followUp({
                embeds: [
                    new MessageEmbed()
                    .setColor('RANDOM')
                    .addField('Error', 'You have to be in the same voice channel as me!')
                ],
                ephemeral: true
            });

        const queue = Player.getQueue(interaction.guild);

        if (!queue.playing) 
            return interaction.followUp({
                embeds: [
                    new MessageEmbed()
                    .setColor('RANDOM')
                    .addField('Error', 'No music is currently being played!')
                ],
                ephemeral: true
            });

        const skippedTrack = queue.current;

        if (queue.skip()) {
            interaction.followUp({
                embeds: [
                    new MessageEmbed()
                    .setColor('RANDOM')
                    .addField('Skip',  `Song **${skippedTrack.title}** has been skipped`)
                    .setThumbnail(skippedTrack.thumbnail)
                    .setFooter(`Paused by \`${interaction.user.tag}\``)
                    .setTimestamp()
                    .setThumbnail(skippedTrack.thumbnail)
                ],
            });
        }
    }
})