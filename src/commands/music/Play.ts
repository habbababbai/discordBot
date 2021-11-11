import { QueryType } from "discord-player";
import { Guild } from "discord.js";
import { Command } from '../../structures/Command';
import Player from '../../structures/Player'

export default new Command({
    name:'play',
    description: 'Plays a song',
    options: [
        {
            name: 'song',
            description: 'Enter song name/url',
            required: true,
            type:'STRING'
        }
    ],
    run: async ({interaction}) => {
        const songTitle = interaction.options.getString('song');

        if (!interaction.member.voice.channel) 
            return interaction.followUp({
                content: 'You have to be in voice channel!'
            });
        
        const searchReasult = await Player.search(songTitle as string, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO
        });

        const queue = await Player.createQueue(interaction.guild as Guild, {
            metadata: interaction.channel
        });

        if (!queue.connection) 
            await queue.connect(interaction.member.voice.channel);

        if (interaction.member.voice.channel.id !== interaction.guild?.me?.voice.channel?.id) 
            return interaction.followUp({
                content: 'You have to be in the same voice channel as me!'
            });

        searchReasult.playlist 
        ? queue.addTracks(searchReasult.tracks) 
        : queue.addTrack(searchReasult.tracks[0]);

        if (!queue.playing) await queue.play();

        interaction.followUp({
            content: `Song added **${searchReasult.tracks[0]}** - requested by **${interaction.user.tag}** - into **${interaction.member.voice.channel.name}**.`
        })

    }
})