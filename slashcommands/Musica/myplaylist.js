const Playlist = require('../../Modelos/playlist');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'myplaylists',
    data: new SlashCommandBuilder()
        .setName('myplaylists')
        .setDescription('Muestra tus listas de reproducción guardadas.'),

    async execute(client, interaction) {
        const userId = interaction.user.id;

        try {
            const playlists = await Playlist.find({ userId });

            if (playlists.length === 0) {
                return interaction.reply({
                    content: '❌ No tienes listas guardadas.',
                    ephemeral: true,
                });
            }

            const playlistNames = playlists.map(playlist => `- **${playlist.name}**`).join('\n');
            interaction.reply(`🎶 Tus listas guardadas:\n${playlistNames}`);
        } catch (error) {
            console.error(error);
            interaction.reply('❌ Ocurrió un error al obtener tus listas.');
        }
    },
};
