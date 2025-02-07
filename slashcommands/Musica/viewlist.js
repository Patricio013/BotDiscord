const Playlist = require('../../Modelos/playlist');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const MAX_SONGS_PER_PAGE = 10;

module.exports = {
    name: 'viewlist',
    data: new SlashCommandBuilder()
        .setName('viewlist')
        .setDescription('Muestra las canciones de una lista personalizada.')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Nombre de la lista.')
                .setRequired(true)
        ),

        async execute(client, interaction) {
            const name = interaction.options.getString('name');
            const userId = interaction.user.id;
    
            await interaction.deferReply({ ephemeral: true });

            try {
                const playlist = await Playlist.findOne({ userId, name });

                if (!playlist) {
                    return interaction.editReply({
                        content: `❌ No se encontró una lista con el nombre **${name}**.`,
                    });
                }

                const totalSongs = playlist.songs.length;
                const totalPages = Math.ceil(totalSongs / MAX_SONGS_PER_PAGE);

                if (totalSongs === 0) {
                    return interaction.editReply({
                        content: `🎶 **${name}** está vacía. Añade canciones primero.`,
                    });
                }

                const getPageContent = (page) => {
                    const start = page * MAX_SONGS_PER_PAGE;
                    const end = start + MAX_SONGS_PER_PAGE;
                    const pageSongs = playlist.songs.slice(start, end)
                        .map((url, index) => `${start + index + 1}. <${url}>`)
                        .join('\n');

                    return `🎶 **${name}** - Página ${page + 1}/${totalPages}\n${pageSongs}`;
                };

                let currentPage = 0;

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('prev')
                            .setLabel('⬅️ Anterior')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setCustomId('next')
                            .setLabel('➡️ Siguiente')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(totalPages <= 1)
                    );

                const message = await interaction.editReply({
                    content: getPageContent(currentPage),
                    components: [row],
                });

                const filter = (i) => i.user.id === interaction.user.id;
                const collector = message.createMessageComponentCollector({
                    filter,
                    time: 60000,
                });

                collector.on('collect', async (btnInteraction) => {
                    if (btnInteraction.customId === 'prev') currentPage--;
                    if (btnInteraction.customId === 'next') currentPage++;

                    const updatedRow = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('prev')
                                .setLabel('⬅️ Anterior')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(currentPage === 0),
                            new ButtonBuilder()
                                .setCustomId('next')
                                .setLabel('➡️ Siguiente')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(currentPage === totalPages - 1)
                        );

                    await btnInteraction.update({
                        content: getPageContent(currentPage),
                        components: [updatedRow],
                    });
                });

                collector.on('end', async () => {
                    const disabledRow = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('prev')
                                .setLabel('⬅️ Anterior')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(true),
                            new ButtonBuilder()
                                .setCustomId('next')
                                .setLabel('➡️ Siguiente')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(true)
                        );

                    await message.edit({
                        components: [disabledRow],
                    });
                });
            } catch (error) {
                console.error(error);
                interaction.editReply('❌ Ocurrió un error al obtener las canciones.');
            }
        },
    };