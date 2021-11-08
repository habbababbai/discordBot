import { Command } from '../../structures/Command';
import { Constants } from 'discord.js';

export default new Command({
    name: 'say',
    description: 'Bot writes text in channel',
    options: [
        {
            name: 'text',
            description: 'Text to write in chat',
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    run: async ({interaction, args}) => {
        interaction.channel?.send(args.getString('text') as string);
        interaction.deleteReply();
    }
})