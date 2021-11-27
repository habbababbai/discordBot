import { Event } from "../structures/Event";
import { client } from "..";
import Player  from "../structures/Player";

export default new Event ('ready', async () => {
    console.log('Bot is online!');

});