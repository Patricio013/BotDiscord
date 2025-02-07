const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const translate = require("@iamtraction/google-translate")

module.exports = {
    name: "traductor",
	data: new SlashCommandBuilder()
    .setName('traductor')
    .setDescription('Traduce palabras a otro idioma')
    .addStringOption(option =>
        option.setName('texto')
            .setDescription('Escribe la palabra a traducir')
            .setRequired(true)
            .setMinLength(2)
            .setMaxLength(4000)
    )
    .addStringOption(option =>
        option.setName('idioma')
            .setDescription('Selecciona el idioma a traducir')
            .setRequired(true)
            .addChoices(
                { name: 'Ingles', value: 'en' },
                { name: 'Frances', value: 'fr' },
                { name: 'Aleman', value: 'de' },
                { name: 'Italiano', value: 'it' },
                { name: 'Portugues', value: 'pt' },
                { name: 'Español', value: 'es' }
            )
    ),

	async execute(client, interaction){

		const texto = interaction.options.getString("texto")
		const lenguaje = interaction.options.getString("idioma")

		await interaction.reply({ content: "🔎 Traduciendo tu mensaje..." })

		const applied = await translate(texto, { to: `${lenguaje}` })

		const embed = new EmbedBuilder()
		.setColor("Green")
		.setDescription(`🔎 | **Mensaje traducido**\n\n**Tu texto:**\n\`\`\`${texto}\`\`\`\n**Texto traducido:**\n\`\`\`${applied.text}\`\`\``)

		await interaction.editReply({ content: "", embeds: [embed] })
	}
}