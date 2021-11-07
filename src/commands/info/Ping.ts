import { Command } from "../../structures/Command";

export default new Command({
    name: 'ping',
    description: 'Replies with client ping',
    run: async ({interaction}) => {
        interaction.followUp('Pong');
    },
    cooldown: 1
})