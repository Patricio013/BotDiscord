const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: "ping",
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Comando de ping (probando xd)'),

    async execute(client, interaction){
        let ping = Math.round(client.ws.ping);
        const embed = new EmbedBuilder()
        .setColor("DarkAqua")
        .setDescription(`Ping => ${ping}`)

        await interaction.reply({embeds: [embed]})
    }
}