import { Command } from '../../structures/Command';
import Player from '../../structures/Player';

export default new Command ({
    name: 'volume',
    description: 'Changes or check volume of player',
    options: [
        {
            name: 'amount',
            description: 'Percentage to change volume to',
            type: 'INTEGER',
            required: false
        }
    ],
    run: async ({interaction}) => {
        const volumePercentage = interaction.options.getInteger('amount');
        const queue = Player.getQueue(interaction.guildId);

        if (!interaction.member.voice.channel) 
            return interaction.followUp({
                content: 'You have to be in voice channel!'
            });

        if (interaction.member.voice.channel.id !== interaction.guild?.me?.voice.channel?.id) return interaction.followUp({content: 'You have to be in the same voice channel as me!'});

        if (!queue.playing) return interaction.followUp({content: 'No music is currently being played!'});

        if (!volumePercentage) return interaction.followUp({ content: `Current volume is \`${queue.volume}%\``});

        if (volumePercentage < 0 || volumePercentage > 100) return interaction.followUp({ content: 'Volume value must be between \'1\' & \'100\'!' });

        queue.setVolume(volumePercentage);

        interaction.followUp({ content: `Volume has been set to \`${volumePercentage}%\`` })


    }
})