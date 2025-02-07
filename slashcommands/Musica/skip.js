const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'skip',
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Saltar la musica que estas escuchando.'),

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

            await interaction.deferReply();

            try {
                if (queue.songs.length <= 1) {
                    await client.distube.stop(interaction);
                    return interaction.followUp('🎶 Solo quedaba una canción en la cola. La reproducción se ha detenido. 🎶');
                }
    
                await client.distube.skip(interaction);
                await interaction.followUp('🎶 Se saltó la canción 🎶');
            } catch (error) {
                console.error(error);
                await interaction.followUp({
                    content: '❌ Ocurrió un error al intentar procesar tu solicitud.',
                    ephemeral: true,
                });
            }
        },
    };