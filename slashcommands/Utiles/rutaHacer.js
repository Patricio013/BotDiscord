const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: "rutaencamino",
    data: new SlashCommandBuilder()
        .setName('rutaencamino')
        .setDescription('Funciones a hacer'),

    async execute(client, interaction){
        let ruta = 'Ruta:\n'
        +'-Hacer que el bot funcione 24/7 ✗\n'
        +'-Chatgpt ✗\n'
        +'-Anti-spam ✗\n';
        const embed = new EmbedBuilder()
        .setColor("DarkAqua")
        .setDescription(`${ruta}`)

        await interaction.reply({embeds: [embed]})
    }
}