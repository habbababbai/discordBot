import { Command } from '../../structures/Command';
import { MessageEmbed } from 'discord.js';

export default new Command({
    name:'resume',
    description: 'Resumes current song.',
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


        queue.setPaused(false);

        interaction.followUp({
            embeds: [
                new MessageEmbed()
                .setColor('RANDOM')
                .addField('Resume',  `Song [**${queue.current.title}**](${queue.current.url}) has been resumed.`)
                .setFooter({text: `Paused by \`${interaction.user.tag}\``})
                .setTimestamp()
                .setThumbnail(queue.current.thumbnail)
            ],
        });
    }
})