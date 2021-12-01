import { QueryType } from "discord-player";
import { Guild, MessageEmbed } from "discord.js";
import { Command } from '../../structures/Command';

export default new Command({
    name:'play',
    description: 'Plays a song.',
    options: [
        {
            name: 'url',
            description: 'Enter song title / url / playlist',
            required: true,
            type:'STRING'
        }
    ],
    run: async ({interaction, player}) => {
        const songTitle = interaction.options.getString('url');
    
        if (!interaction.member.voice.channel) 
        return interaction.followUp({
            embeds: [
                new MessageEmbed()
                .setColor('RANDOM')
                .addField('Error', 'You have to be in voice channel!')
            ],
            ephemeral: true
        });
        
        const searchReasult = await player.search(songTitle as string, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO
        });
        
        const queue = await player.createQueue(interaction.guild as Guild, {
            metadata: interaction.channel
        });

        try {
            if (!queue.connection) 
                await queue.connect(interaction.member.voice.channel);
        } catch (error) {
            player.deleteQueue(interaction.guild);
            return interaction.followUp({
                embeds: [
                    new MessageEmbed()
                    .setColor('RANDOM')
                    .addField('Error', 'Could not join your voice channel!')
                ],
                ephemeral: true
            });
        }

        if (!queue.connection) 
            await queue.connect(interaction.member.voice.channel);

        if (interaction.member.voice.channel.id !== interaction.guild?.me?.voice.channel?.id) 
            return interaction.followUp({
                embeds: [
                    new MessageEmbed()
                    .setColor('RANDOM')
                    .addField('Error', 'You have to be in the same voice channel as me!')
                ],
                ephemeral: true
            });
        
        queue.setVolume(player.defaultVolume);

        searchReasult.playlist 
        ? queue.addTracks(searchReasult.tracks) 
        : queue.addTrack(searchReasult.tracks[0]);

        if (!queue.playing) await queue.play();

        interaction.followUp({
            embeds: [
                new MessageEmbed()
                .setColor('RANDOM')
                .addField('Play', `Song added to queue **${searchReasult.tracks[0]}** \n into **${interaction.member.voice.channel.name}**.`)
                .setThumbnail(searchReasult.tracks[0].thumbnail)
                .setFooter(`Queued by \`${interaction.member.nickname}\``)
                .setFooter(`Used by \`${interaction.user.tag}\``)
                .setTimestamp()
            ]
        })

    }
})