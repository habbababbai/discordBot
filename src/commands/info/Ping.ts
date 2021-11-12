import { MessageEmbed } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
    name: 'ping',
    description: 'Replies with client ping',
    run: async ({interaction, client}) => {
        //interaction.followUp(`Pong! Websocket: ${client.ws.ping}`);
        interaction.followUp({
            embeds: [
                new MessageEmbed()
                .setColor('RANDOM')
                .addField('PONG!', `Websocket: **\`${client.ws.ping}\`**`)
                .setFooter(`Pinged by \`${interaction.user.tag}\``)
                .setTimestamp()
            ]
        })
    },
})