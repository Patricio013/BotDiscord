const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'play',
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Reproduce música en el canal de voz.')
        .addStringOption(option =>
            option
                .setName('query')
                .setDescription('URL o nombre de la canción')
                .setRequired(true)
        ),

        async execute(client, interaction){
            const query = interaction.options.getString('query');
            const voiceChannel = interaction.member.voice.channel;

            if (!voiceChannel) {
                return interaction.reply({
                    content: '❌ Debes estar en un canal de voz para usar este comando.',
                    ephemeral: true,
                });
            }

            if (interaction.guild.members.me.voice?.channel && (interaction.member.voice.channel.id !== interaction.guild.members.me.voice?.channel.id)) {
                return interaction.reply({
                    content:'❌ Debes estar en el mismo canal de voz con el bot para usar este comando.',
                    ephemeral: true,
                });
            }

            await interaction.deferReply();

            try {
                const queue = client.distube.getQueue(interaction);
    
                if (queue) {
                    await client.distube.play(voiceChannel, query, {
                        member: interaction.member,
                        textChannel: interaction.channel,
                        interaction,
                    });
    
                    return interaction.followUp(`🎶 La canción **${query}** fue añadida a la cola. 🎶`);
                }
    
                await client.distube.play(voiceChannel, query, {
                    member: interaction.member,
                    textChannel: interaction.channel,
                    interaction,
                });
    
                await interaction.followUp(`🎶 Reproduciendo ahora: **${query}** 🎶`);
            } catch (error) {
                console.error('Error en comando /play:', error);

                if (error.message.includes('FFMPEG_EXITED')) {
                    await interaction.followUp({
                        content: '❌ Error: FFMPEG no pudo procesar la canción. Asegúrate de que el archivo o enlace sea válido.',
                        ephemeral: true,
                    });
                } else {
                    await interaction.followUp({
                        content: '❌ Ocurrió un error al intentar reproducir la canción.',
                        ephemeral: true,
                    });
                }
            }
        },
};