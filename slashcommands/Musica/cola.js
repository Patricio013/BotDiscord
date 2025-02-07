const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const MAX_SONGS_PER_PAGE = 15;

module.exports = {
    name: 'queue',
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Muestra la cola de reproducción actual.'),

        async execute(client, interaction) {
            const queue = client.distube.getQueue(interaction);
            const voiceChannel = interaction.member.voice.channel;
    
            if (!voiceChannel) {
                return interaction.reply({
                    content: '❌ Debes estar en un canal de voz para usar este comando.',
                    ephemeral: true,
                });
            }
    
            if (interaction.guild.members.me.voice?.channel &&
                (interaction.member.voice.channel.id !== interaction.guild.members.me.voice?.channel.id)) {
                return interaction.reply({
                    content: '❌ Debes estar en el mismo canal de voz con el bot para usar este comando.',
                    ephemeral: true,
                });
            }
    
            if (!queue || !queue.songs.length) {
                return interaction.reply({
                    content: '❌ No hay canciones en la cola.',
                    ephemeral: true,
                });
            }
    
            await interaction.deferReply();

            const totalSongs = queue.songs.length;
            const totalPages = Math.ceil(totalSongs / MAX_SONGS_PER_PAGE);

            const getPageContent = (page) => {
                const start = page * MAX_SONGS_PER_PAGE;
                const end = start + MAX_SONGS_PER_PAGE;
                const pageSongs = queue.songs.slice(start, end).map((song, index) => {
                    const position = start + index + 1;
                    return `${position}. **${song.name}** - \`${song.formattedDuration}\``;
                }).join('\n');

                return `🎶 **Cola de reproducción:** Página ${page + 1}/${totalPages}\n${pageSongs}`;
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
        },
    };
