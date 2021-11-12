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

        
        const embed: MessageEmbed = new MessageEmbed();

        const nowPlaying = queue.current;
        const header = `| [**${nowPlaying.title}**](${nowPlaying.url}) - \`${nowPlaying.requestedBy.tag}\`\n\n`;
        embed.setColor('RANDOM')
            .setTitle(`Song Queue - ${interaction.guild.name}`)
            .setFooter(`Queued by ${interaction.user.tag}`)
            .addField('Current', header)
            .setThumbnail(nowPlaying.thumbnail)
            .setTimestamp()
            
        if (queue.tracks.length < 5 && queue.tracks.length > 0) {
            let tracks: string = '';
            for (let i = 1; i < queue.tracks.length; i++) {
                const track = queue.tracks[i];
                tracks += `\`${i + 1}\` - [**${track.title}**](${track.url}) - \`${track.requestedBy.tag}\``;
            }
        }

        if (queue.tracks.length > 0) {
            let tracks: string = '';
            for (let i = 0; i < 5; i++) {
                if (queue.tracks[i]) {
                    const track = queue.tracks[i];
                    tracks += `\`${i + 1}\` - [**${track.title}**](${track.url}) - \`${track.requestedBy.tag}\` \n`;
                }
            }
            if (queue.tracks.length > 5) {
                tracks += '\n \`More in queue...\`'
            }
            if (tracks !== '') {
                embed.addField('Queue', tracks);
            }
        }

        interaction.followUp({embeds: [embed]});

    }
})