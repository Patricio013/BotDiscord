const Playlist = require('../../Modelos/playlist');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'addtolist',
    data: new SlashCommandBuilder()
        .setName('addtolist')
        .setDescription('Agrega canciones a una lista personalizada.')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Nombre de la lista.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('song')
                .setDescription('URL o título de la canción.')
                .setRequired(true)
        ),

    async execute(client, interaction) {
        const name = interaction.options.getString('name');
        const song = interaction.options.getString('song');
        const userId = interaction.user.id;

        try {
            const playlist = await Playlist.findOne({ userId, name });

            if (!playlist) {
                return interaction.reply({
                    content: `❌ No se encontró una lista con el nombre **${name}**.`,
                    ephemeral: true,
                });
            }

            playlist.songs.push(song);
            await playlist.save();

            interaction.reply(`✅ Canción añadida a la lista **${name}**.`);
        } catch (error) {
            console.error(error);
            interaction.reply('❌ Ocurrió un error al agregar la canción.');
        }
    },
};
