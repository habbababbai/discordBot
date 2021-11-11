import { Guild, MessageEmbed } from "discord.js";
import { Command } from '../../structures/Command';
import Player from '../../structures/Player'

export default new Command({
    name:'queue',
    description: 'Displays all songs in queue',
    run: async ({interaction}) => {
        
        const queue = await Player.createQueue(interaction.guild as Guild, {metadata: interaction.channel});

        if (!interaction.member.voice.channel) 
            return interaction.followUp({
                content: 'You have to be in voice channel!'
            });
               
        if (interaction.member.voice.channel.id !== interaction.guild?.me?.voice.channel?.id) 
            return interaction.followUp({
                content: 'You have to be in the same voice channel as me!'
            });

        if (!queue.playing) 
            return interaction.followUp({content: `No music is currently being played!`});

        const currentTrack = queue.current;

        const tracks = queue.tracks.slice(0, 10).map((m, i) => {
            return `\`${i + 1}.\` - [**${m.title}**](${m.url}) - \`${m.requestedBy.tag}\``;
        });

        const queueEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle(`Song Queue - ${interaction.guild.name}`)
            .setFooter(`Queued by ${interaction.user.tag}`)
            .addFields([
                { 
                    name: 'Current:', 
                    value: `| [**${currentTrack.title}**](${currentTrack.url}) - \`${currentTrack.requestedBy.tag}\`\n\n`},
                {
                    name: 'Queue', 
                    value: `${tracks.join("\n")}${queue.tracks.length > tracks.length ? `\n...${queue.
                    tracks.length - tracks.length === 1 ? `${queue.tracks.length - tracks.length} more track` : `${queue.
                    tracks.length - tracks.length} more tracks`}` : ""}`
                },
            ])
            .setThumbnail(currentTrack.thumbnail)
            .setTimestamp()

        interaction.followUp({
            embeds: [queueEmbed]
        })

    }
})