import { Event } from '../structures/Event';
import { ExtendedInteraction} from '../typings/Command'
import { client } from "../";
import { CommandInteractionOptionResolver } from 'discord.js';


export default new Event('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        await interaction.deferReply();
        const command = client.commands.get(interaction.commandName);
        if (!command) {
            return interaction.reply('You have used an non existent command!');
        }

    
        command.run({
            args: interaction.options as CommandInteractionOptionResolver,
            client,
            interaction: interaction as ExtendedInteraction
        });
    }
});