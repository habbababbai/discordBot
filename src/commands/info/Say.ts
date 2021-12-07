import { Command } from '../../structures/Command';
import { Constants, MessageEmbed } from 'discord.js';

export default new Command({
    name: 'say',
    description: 'Bot writes text in channel. REQUIRES ADMIN PERMS',
    options: [
        {
            name: 'text',
            description: 'Text to write in chat',
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    userPermissions: [
        'ADMINISTRATOR'
    ],
     

    run: async ({interaction, args}) => {
        interaction.channel?.send(args.getString('text') as string);
        interaction.followUp({
            embeds:[
                new MessageEmbed()
                .setColor('RANDOM')
                .addField('Say', `Executed command`)
                .setFooter(`Used by \`${interaction.user.tag}\``)
                .setTimestamp()
            ]});
    }
    
})