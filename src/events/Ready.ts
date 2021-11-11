import { Event } from "../structures/Event";
import { client } from "..";
import { ApplicationCommand, PermissionResolvable } from "discord.js";


export default new Event ('ready', async () => {
    console.log('Bot is online!');
    
    /** Deploying guild slash commands */
    /*
    const guild = await client.guilds.cache.get(process.env.guildId as string);
    client.slashCommands.forEach(async command => {
        await guild?.commands.create(command);
    });
    */
    

});