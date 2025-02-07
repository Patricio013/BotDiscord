const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'seek',
    data: new SlashCommandBuilder()
        .setName('seek')
        .setDescription('Salta a un tiempo específico en la canción actual.')
        .addIntegerOption(option =>
            option
                .setName('seconds')
                .setDescription('Tiempo en segundos al que deseas saltar.')
                .setRequired(true)
        ),

    async execute(client, interaction) {
        const queue = client.distube.getQueue(interaction);
        const seconds = interaction.options.getInteger('seconds'); 
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

        try {
            client.distube.seek(interaction, seconds);
            interaction.reply(`⏩ Se ha saltado a los **${seconds} segundos** de la canción.`);
        } catch (error) {
            console.error(error);
            interaction.reply({
                content: '❌ Hubo un error al intentar realizar el adelantar.',
                ephemeral: true,
            });
        }
    },
};
