import { Client, MessageEmbed, TextChannel } from "discord.js";
import { Player } from "discord-player";


export class ExtendedPlayer extends Player {
    defaultVolume: number = 50;
    constructor(client: Client) {
        super(client, {
            ytdlOptions: {
                quality: 'highestaudio',
                filter: 'audioonly',
                highWaterMark: 1 << 25,
                dlChunkSize: 0,
            },
        });
        this.start();
    }
    start() {
        this
        .on('trackStart', (queue, track) => {
            (queue.metadata as TextChannel).send({embeds: [
                new MessageEmbed()
                .setColor('RANDOM')
                .addField('Now playing', `Song **${track}** \n in **${queue.connection.channel}**.`)
                .setThumbnail(track.thumbnail)
                .setFooter(`Queued by \`${track.requestedBy.tag}\``)
                .setTimestamp()
            ]})
        })
        .on('trackEnd', async (queue) => {
            const channel = queue.connection.channel;
            if (channel.members.size - 1 === 0) {
                (queue.metadata as TextChannel).send({embeds: [
                    new MessageEmbed()
                    .setColor('RANDOM')
                    .addField('Disconnect', `**${channel.name}** is empty. Leaving voice channel!`)
                    .setTimestamp()
                ]});
                await queue.connection.disconnect();
                await queue.stop();
            }
        })
        .on('connectionCreate', (queue, connection) => {
            (queue.metadata as TextChannel).send({embeds: [
                new MessageEmbed()
                .setColor('RANDOM')
                .addField('Join', `Joining **${connection.channel.name}** voice channel!`)
                .setTimestamp()
            ]});
        })
        .on('error', (queue, error) => {
            console.log(`**${queue.guild.name}**: Error emitted from the queue: **${error.message}**`);
        })
        .on('connectionError', (queue, error) => {
            console.log(`**${queue.guild.name}**: Error emitted from the queue: **${error.message}**`);
        })
        
    }
}

