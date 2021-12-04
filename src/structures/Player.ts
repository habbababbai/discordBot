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
                .addField('Now playing', `Song [**${track.title}**](${track.url}) by ${track.author} \n in **${queue.connection.channel}**.`)
                .setThumbnail(track.thumbnail)
                .setFooter(`Queued by \`${track.requestedBy.tag}\``)
                .setTimestamp()
            ]})
        })
        .on('trackEnd', (queue) => {
            // bypass for channelEmpty event not emmiting
            const channel = queue.connection.channel;
            if (channel.members.size === 1) {
                (queue.metadata as TextChannel).send({embeds: [
                    new MessageEmbed()
                    .setColor('RANDOM')
                    .addField('Queue', `**${channel.name}** is empty. Leaving voice channel!`)
                    .setTimestamp()
                ]});
                queue.stop();
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
            console.log(`${queue.guild.name}: Error emitted from the queue: ${error.message}`);
            const channel = queue.connection.channel;
            (queue.metadata as TextChannel).send({embeds: [
                new MessageEmbed()
                .setColor('RANDOM')
                .addField('Error', `An error has occured **${error.name}**: ${error.message}.`)
                .setTimestamp()
            ]});
            if (!queue.destroyed) {
                queue.clear();
                queue.stop();
            }
        })
        .on('connectionError', (queue, error) => {
            console.log(`**${queue.guild.name}**: Error emitted from the queue: **${error.message}**`);
        })
        .on('queueEnd', (queue) => {
            (queue.metadata as TextChannel).send({embeds: [
                new MessageEmbed()
                .setColor('RANDOM')
                .addField('Disconnect', `**Queue** is empty. Leaving voice channel!`)
                .setTimestamp()
            ]});
        })
        .on('channelEmpty', (queue) => {
            //Idk why but this event doesn't seem to emit ;-;
            console.log('voice channel is empty')
        })
        
    }
}

