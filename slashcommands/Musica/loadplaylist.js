const Playlist = require('../../Modelos/playlist');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'loadplaylist',
    data: new SlashCommandBuilder()
        .setName('loadplaylist')
        .setDescription('Carga una de tus listas de reproducción.')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Nombre de la lista.')
                .setRequired(true)
        ),

    async execute(client, interaction) {
        const name = interaction.options.getString('name');
        const userId = interaction.user.id;
        const voiceChannel = interaction.member.voice.channel;

        await interaction.deferReply();

        if (!voiceChannel) {
            return interaction.editReply({
                content: '❌ Debes estar en un canal de voz para usar este comando.',
                ephemeral: true,
            });
        }

        if (interaction.guild.members.me.voice?.channel && (interaction.member.voice.channel.id !== interaction.guild.members.me.voice?.channel.id)) {
            return interaction.editReply({
                content:'❌ Debes estar en el mismo canal de voz con el bot para usar este comando.',
                ephemeral: true,
            });
        }

        try {
            const playlist = await Playlist.findOne({ userId, name });

            if (!playlist) {
                return interaction.editReply({
                    content: `❌ No se encontró una lista con el nombre **${name}**.`,
                    ephemeral: true,
                });
            }

            const validUrls = playlist.songs
                .map(cleanUrl) 
                .filter(url => url !== null); 

            if (validUrls.length === 0) {
                return interaction.editReply({
                    content: '❌ La lista no contiene canciones válidas.',
                    ephemeral: true,
                });
            }

            const customPlaylist = await client.distube.createCustomPlaylist(validUrls, {
                member: interaction.member,
                properties: { name: playlist.name },
            });

            await client.distube.play(voiceChannel, customPlaylist, {
                member: interaction.member,
                textChannel: interaction.channel,
                interaction,
            });

            interaction.editReply(`🎶 Se cargó la lista de reproducción: **${name}**.`);
        } catch (error) {
            console.error(error);
            interaction.editReply('❌ Ocurrió un error al cargar tu lista.');
        }
    },
};

function cleanUrl(url) {
    const match = url.match(/(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    if (match) {
        return `https://www.youtube.com/watch?v=${match[4]}`;
    }
    return null;
}
