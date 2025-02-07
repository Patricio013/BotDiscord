const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: "8ball",
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Pregúntale algo al bot y obtén una respuesta al azar.')
        .addStringOption(option =>
            option.setName('pregunta')
                .setDescription('La pregunta que quieres hacerle al bot')
                .setRequired(true)),

    async execute(client, interaction) {
        const pgr = interaction.options.getString('pregunta');

        const respuestasConPesos = [
            { respuesta: "Si", peso: 10 },
            { respuesta: "No", peso: 8 },
            { respuesta: "Tal vez", peso: 9 },
            { respuesta: "No se xd", peso: 7 },
            { respuesta: "Juan 🐴", peso: 1 }
        ];

        const totalPeso = respuestasConPesos.reduce((total, r) => total + r.peso, 0);

        const random = Math.random() * totalPeso;

        let acumulado = 0;
        const botrespuesta = respuestasConPesos.find(r => {
            acumulado += r.peso;
            return random < acumulado;
        }).respuesta;


        const embed = new EmbedBuilder()
            .setColor("DarkAqua")
            .setDescription(`🎱 | Tu pregunta: ${pgr}
            Respuesta: ${botrespuesta}`);

        await interaction.reply({ embeds: [embed] });
    }
};
