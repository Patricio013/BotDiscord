const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: "rutacompletadas",
    data: new SlashCommandBuilder()
        .setName('rutacompletadas')
        .setDescription('Funciones hechas'),

    async execute(client, interaction){
        let ruta = 'Ruta:\n'
        +'-Conectar el bot ✓\n'
        +'-8Ball ✓\n'
        +'-Arreglar comando banner ✓\n'
        +'-Traductor ✓\n'
        +'-Reproducir musica ✓\n'
        +'-Calendario ✓\n';
        const embed = new EmbedBuilder()
        .setColor("DarkAqua")
        .setDescription(`${ruta}`)

        await interaction.reply({embeds: [embed]})
    }
}