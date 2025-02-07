const Playlist = require('../../Modelos/playlist');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'createlist',
    data: new SlashCommandBuilder()
        .setName('createlist')
        .setDescription('Crea una lista de reproducción personalizada.')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Nombre de la lista.')
                .setRequired(true)
        ),

    async execute(client, interaction) {
        const name = interaction.options.getString('name');
        const userId = interaction.user.id;

        try {
            const existingPlaylist = await Playlist.findOne({ userId, name });

            if (existingPlaylist) {
                return interaction.reply({
                    content: '❌ Ya tienes una lista con este nombre. Elige otro nombre.',
                    ephemeral: true,
                });
            }

            await Playlist.create({
                userId,
                name,
                songs: [],
            });

            interaction.reply(`✅ Lista de reproducción **${name}** creada. Usa \`/addtolist\` para agregar canciones.`);
        } catch (error) {
            console.error(error);
            interaction.reply('❌ Ocurrió un error al crear tu lista.');
        }
    },
};