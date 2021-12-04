import { QueryType, Track } from "discord-player";
import { Guild, MessageEmbed } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command ({
    name: 'insert',
    description: 'Insert song into queue.',
    options: [
        {
            name: 'url',
            description: 'Enter song title / url / playlist from Youtube / Spotify / Soundcloud',
            required: true,
            type: 'STRING'
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

        

        if (searchReasult.playlist) {
            interaction.followUp({
                embeds: [
                    new MessageEmbed()
                    .setColor('RANDOM')
                    .addField('Error!', 'You can only insert one song at a time! Inserting first song of playlist.')
                ],
                ephemeral: true
            })
        }
        queue.insert(searchReasult.tracks[0]);

        if (!queue.playing) await queue.play();

        const embed = new MessageEmbed();

        const current:Track = searchReasult.tracks[0];
        const trackInfo: string = `| [**${current.title}**](${current.url}) - \`${current.requestedBy.tag}\`\n\n`;
        embed.setColor('RANDOM')
            .setTitle(`Inserted Song - ${interaction.guild.name}`)
            .setFooter(`Used by \`${interaction.user.tag}\``)
            .addField('Song', trackInfo)
            .setThumbnail(current.thumbnail)
            .setTimestamp()

        

        interaction.followUp({embeds: [embed]});


    }
})