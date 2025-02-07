const Playlist = require('../../Modelos/playlist');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'saveplaylist',
    data: new SlashCommandBuilder()
        .setName('saveplaylist')
        .setDescription('Guarda la cola de musicas que se esta reproduccion.')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Nombre de la lista.')
                .setRequired(true)
        ),

    async execute(client, interaction) {
        const name = interaction.options.getString('name');
        const userId = interaction.user.id;
        const queue = client.distube.getQueue(interaction);

        if (!queue || !queue.songs || queue.songs.length === 0) {
            return interaction.reply({
                content: '❌ No hay canciones en la cola para guardar.',
                ephemeral: true,
            });
        }

        const songs = queue.songs.map(song => song.url);

        try {
            await Playlist.create({
                userId,
                name,
                songs,
            });

            interaction.reply(`✅ Tu lista **${name}** ha sido guardada.`);
        } catch (error) {
            console.error(error);
            interaction.reply('❌ Ocurrió un error al guardar tu lista.');
        }
    },
};
