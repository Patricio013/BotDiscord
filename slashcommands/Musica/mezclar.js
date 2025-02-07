const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'mezclar',
    data: new SlashCommandBuilder()
        .setName('mezclar')
        .setDescription('Mezcla la cola de musicas.'),

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

        try {
            client.distube.shuffle(interaction);
            interaction.reply(`🔀 La cola ha sido mezclada.`);
        } catch (error) {
            console.error(error);
            interaction.reply({
                content: '❌ Hubo un error al intentar realizar el seek.',
                ephemeral: true,
            });
        }
    },
};
