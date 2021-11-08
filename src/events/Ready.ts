import { Event } from "../structures/Event";
import { client } from "..";

export default new Event ('ready', () => {
    console.log('Bot is online!');
    const guild = client.guilds.cache.get(process.env.guildId as string);
    client.slashCommands.forEach(command => {
        guild?.commands.create(command);
        console.log(`Created slash command: ${command.name}`);
    })
});