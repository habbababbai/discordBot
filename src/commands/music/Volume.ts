import { Command } from '../../structures/Command';
import Player from '../../structures/Player';
import { MessageEmbed } from 'discord.js';

export default new Command ({
    name: 'volume',
    description: 'Changes or check volume of player',
    options: [
        {
            name: 'amount',
            description: 'Percentage to change volume to',
            type: 'INTEGER',
            required: false
        }
    ],
    run: async ({interaction}) => {
        const volumePercentage = interaction.options.getInteger('amount');
        const queue = Player.getQueue(interaction.guildId);

        if (!interaction.member.voice.channel) 
            return interaction.followUp({
                embeds: [
                    new MessageEmbed()
                    .setColor('RANDOM')
                    .addField('Error', 'You have to be in voice channel!')
                ],
                ephemeral: true
            });

        if (!queue.playing) 
            return interaction.followUp({
                embeds: [
                    new MessageEmbed()
                    .setColor('RANDOM')
                    .addField('Error', 'No music is currently being played!')
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


        if (!volumePercentage) 
            return interaction.followUp({ 
                embeds: [
                    new MessageEmbed()
                    .setColor('RANDOM')
                    .addField('Percentage', `Current volume is \`${queue.volume}%\``)
                    .setFooter(`Checked by \`${interaction.user.tag}\``)
                    .setTimestamp()
                ]
            });

        if (volumePercentage < 0 || volumePercentage > 100) return interaction.followUp({ content: 'Volume value must be between \'1\' & \'100\'!' });

        queue.setVolume(volumePercentage);

        interaction.followUp({
            embeds: [
                new MessageEmbed()
                .setColor('RANDOM')
                .addField('Percentage', `Volume has been set to \`${volumePercentage}%\``)
                .setFooter(`Checked by \`${interaction.user.tag}\``)
                .setTimestamp()
            ] 
        })


    }
})