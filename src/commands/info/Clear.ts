import { MessageEmbed, TextChannel } from "discord.js";
import { Command } from "../../structures/Command";
import { Constants } from "discord.js";

export default new Command({
    name: 'clear',
    description: 'deletes last n number of messages in text channel',
    options: [
        {
            name: 'number',
            description: 'number of messages to delete 1-99',
            required: false,
            type: Constants.ApplicationCommandOptionTypes.NUMBER
        }
    ],
    userPermissions: [
        "ADMINISTRATOR"
    ],
    run: async ({interaction}) => {
        const option = interaction.options.getNumber('number');
        let number;
        if (!option) {
            number = 1;
        }
        else if (option < 1 || option > 99) {
            return interaction.followUp({
                embeds: [
                    new MessageEmbed()
                    .setColor('RANDOM')
                    .addField('Error', 'Value must be between \'1\' and \'99\'!')
                ],
                ephemeral: true})
        } else {
            number = option + 1;
        }
        await interaction.channel.messages.fetch({limit: number}).then(async messages => {
            const channel = interaction.channel as TextChannel;
            const messagesDeleted = await channel.bulkDelete(messages, true);
            const oldCount = number - messagesDeleted.size;
            
            interaction.followUp({
                embeds: [
                    new MessageEmbed()
                    .setColor('RANDOM')
                    .addField('Clear', `Deleted \'${messagesDeleted.size - 1}\' messages succesfully! \n **${oldCount}** messages were too old to delete!`)
                ]
            });
        });
    },
})