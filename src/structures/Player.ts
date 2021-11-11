import { Player, QueryType, QueueRepeatMode } from "discord-player";
import { client } from '../index';

export default new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25
    }
})