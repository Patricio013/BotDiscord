const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'pause',
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pausa la musica.'),

        async execute(client, interaction){
            const queue = client.distube.getQueue(interaction);
             
            const voiceChannel = interaction.member.voice.channel;

            if (!voiceChannel) {
                return interaction.reply({
                    content: '❌ Debes estar en un canal de voz para usar este comando.',
                    ephemeral: true,
                });
            }

            if (interaction.guild.members.me.voice?.channel && (interaction.member.voice.channel.id !== interaction.guild.members.me.voice?.channel.id)) {
                return interaction.reply({
                    content: '❌ Debes estar en el mismo canal de voz con el bot para usar este comando.',
                    ephemeral: true,
                });
            }

            if (!queue){
                return interaction.reply({
                    content: '❌ Debe haber musica para usar este comando.',
                    ephemeral: true,
                })
            }

            if (queue.paused) {
                return interaction.reply({
                    content: '⏸️ La canción ya está pausada.',
                    ephemeral: true,
                });
            }

            await interaction.deferReply();

            try {
                await client.distube.pause(interaction);
                await interaction.followUp('⏸️ Se pauso la canción.');
            } catch (error) {
                console.error(error);
                await interaction.followUp({
                    content: '❌ Ocurrió un error al intentar procesar tu solicitud.',
                    ephemeral: true,
                });
            }
        },
    };