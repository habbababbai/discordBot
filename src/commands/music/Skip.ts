import { Command } from '../../structures/Command';
import Player from '../../structures/Player'

export default new Command({
    name:'skip',
    description: 'Skips current song',
    run: async ({interaction}) => {
        if (!interaction.member.voice.channel) 
            return interaction.followUp({
                content: 'You have to be in voice channel!'
            });

        if (interaction.member.voice.channel.id !== interaction.guild?.me?.voice.channel?.id) return interaction.followUp({content: 'You have to be in the same voice channel as me!'});

        const queue = Player.getQueue(interaction.guild);

        if (!queue.playing) return interaction.followUp({content: 'No music is currently being played!'});

        const skippedTrack = queue.current;

        if (queue.skip()) {
            interaction.followUp({content: `Song **${skippedTrack.title}** has been skipped`});
        }
    }
})