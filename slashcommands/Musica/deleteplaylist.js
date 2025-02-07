const Playlist = require('../../Modelos/playlist');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'deleteplaylist',
    data: new SlashCommandBuilder()
        .setName('deleteplaylist')
        .setDescription('Elimina una playlist personalizada.')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Nombre de la playlist que deseas eliminar.')
                .setRequired(true)
        ),

    async execute(client, interaction) {
        const name = interaction.options.getString('name');
        const userId = interaction.user.id;

        await interaction.deferReply({ ephemeral: true });

        try {
            const playlist = await Playlist.findOneAndDelete({ userId, name });

            if (!playlist) {
                return interaction.editReply({
                    content: `❌ No se encontró una playlist con el nombre **${name}**.`,
                });
            }

            interaction.editReply({
                content: `✅ La playlist **${name}** ha sido eliminada exitosamente.`,
            });
        } catch (error) {
            console.error(error);
            interaction.editReply({
                content: '❌ Ocurrió un error al intentar eliminar la playlist.',
            });
        }
    },
};