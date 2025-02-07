const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'setrepeat',
    data: new SlashCommandBuilder()
        .setName('setrepeat')
        .setDescription('Configura el modo de repetición.')
        .addIntegerOption(option =>
            option
                .setName('mode')
                .setDescription('Modo de repetición: 0 (sin), 1 (canción), 2 (cola)')
                .setRequired(true)
        ),
    
        async execute(client, interaction) {
            const mode = interaction.options.getInteger('mode');
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

            if (![0, 1, 2].includes(mode)) {
                return interaction.reply({
                    content: '❌ El modo debe ser 0 (sin repetición), 1 (repetir canción), o 2 (repetir cola).',
                    ephemeral: true,
                });
            }

            try {
                const repeatMode = client.distube.setRepeatMode(interaction, mode);
                const modeNames = ['❌ Sin repetición', '🔂 Repetir canción', '🔁 Repetir cola'];
                interaction.reply(`Modo de repetición configurado: ${modeNames[repeatMode]}.`);
            } catch (error) {
                console.error(error);
                interaction.reply({
                    content: '❌ Hubo un error al intentar configurar el modo de repetición.',
                    ephemeral: true,
                });
            }
        },
};