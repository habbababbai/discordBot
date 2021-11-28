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
        .setFooter(`Queued by \`${track.author}\``)
        .setTimestamp()
    ]})
})