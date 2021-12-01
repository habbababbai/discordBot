import { Guild, MessageEmbed } from "discord.js";
import { Command } from '../../structures/Command';

export default new Command({
    name:'shuffle',
    description: 'Shuffles songs in queue.',
    run: async ({interaction, player}) => {
        
        const queue = await player.getQueue(interaction.guild);

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

        if (!queue) 
            return interaction.followUp({
                embeds: [
                    new MessageEmbed()
                    .setColor('RANDOM')
                    .addField('Error', 'Queue is empty!')
                ],
                ephemeral: true
            });

        await queue.shuffle();

        return interaction.followUp({
            embeds: [
                new MessageEmbed()
                .setColor('RANDOM')
                .addField('Shuffle', 'Shuffled the queue!')
            ]
        })

    }
})