import { Event } from '../structures/Event';
import { ExtendedInteraction} from '../typings/Command'
import { client } from "../";
import { CommandInteractionOptionResolver, MessageEmbed } from 'discord.js';
import { ExtendedPlayer } from '../structures/Player';

export default new Event('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (command.userPermissions) {
            if (!interaction.memberPermissions.has(command.userPermissions)){
                return interaction.reply({embeds: [
                    new MessageEmbed()
                    .setColor('RANDOM')
                    .addField('Error', `You do not have required permissions to use this command! \n Missing perms: **${command.userPermissions}**`)
                ],
                ephemeral: true});
            }
        }
        await interaction.deferReply({ephemeral: true });

        command.run({
            args: interaction.options as CommandInteractionOptionResolver,
            client,
            interaction: interaction as ExtendedInteraction,
            player: client.player as ExtendedPlayer,
        });
    }
});