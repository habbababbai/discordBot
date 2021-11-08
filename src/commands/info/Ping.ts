import { Command } from "../../structures/Command";

export default new Command({
    name: 'ping',
    description: 'Replies with client ping',
    run: async ({interaction, client}) => {
        interaction.followUp(`Pong! Websocket: ${client.ws.ping}`);
    },
})