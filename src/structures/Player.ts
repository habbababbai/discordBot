import { Player } from "discord-player";
import { client } from '../index';

export default new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
        dlChunkSize: 0,
    }
})