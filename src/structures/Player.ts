import { MessageEmbed, TextChannel } from "discord.js";
import { Player } from "discord-player";
import { client } from '../index';

export default new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        filter: 'audioonly',
        highWaterMark: 1 << 25,
        dlChunkSize: 0,
    },
}).on('trackStart', (queue, track) => {
    (queue.metadata as TextChannel).send({embeds: [
        new MessageEmbed()
        .setColor('RANDOM')
        .addField('Now playing', `Song **${track}** \n in **${queue.connection.channel}**.`)
        .setThumbnail(track.thumbnail)
        .setFooter(`Queued by \`${track.requestedBy}\``)
        .setTimestamp()
    ]})
}).on('channelEmpty', (queue) => {
    console.log('channelEmpty event run!');
    const channel = queue.connection.channel;
    queue.stop();
    (queue.metadata as TextChannel).send({embeds: [
        new MessageEmbed()
        .setColor('RANDOM')
        .addField('Disconnect', `**${channel.name}** is empty. Leaving voice channel!`)
        .setTimestamp()
    ]});
}).on('connectionCreate', (queue, connection) => {
    (queue.metadata as TextChannel).send({embeds: [
        new MessageEmbed()
        .setColor('RANDOM')
        .addField('Join', `Joining **${connection.channel.name}** voice channel!`)
        .setTimestamp()
    ]});
})