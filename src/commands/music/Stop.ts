import { Command } from '../../structures/Command';
import { MessageEmbed } from 'discord.js';

export default new Command({
    name:'stop',
    description: 'Stops current song and leaves voice channel.',
    run: async ({interaction, player}) => {
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

        const queue = player.getQueue(interaction.guild);

        if (!queue.playing) 
            return interaction.followUp({
                embeds: [
                    new MessageEmbed()
                    .setColor('RANDOM')
                    .addField('Error', 'No music is currently being played!')
                ],
                ephemeral: true
            });
        
        if (!queue.destroyed) {
            queue.clear();
            queue.stop();
        }
        interaction.followUp({
            embeds: [
                new MessageEmbed()
                .setColor('RANDOM')
                .addField('Stop',  `Music stopped and left voice channel.`)
                .setFooter(`Stopped by \`${interaction.user.tag}\``)
                .setTimestamp()
            ],
        });
    }
})