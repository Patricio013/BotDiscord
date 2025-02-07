const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: "setbanner",
    data: new SlashCommandBuilder()
    .setName('setbanner')
    .setDescription('Banner del bot')
    .addAttachmentOption(option =>
        option.setName('banner')
            .setDescription('Selecciona la imagen')
            .setRequired(true)
    ),

    async execute(client, interaction) {
        const ownerId = '386167997238345740';
        if (interaction.user.id !== ownerId) {
            return await interaction.reply({ content: '❌ No tienes permiso para usar este comando.', ephemeral: true });
        }
        await interaction.deferReply();
        try {
            const banner = interaction.options.getAttachment("banner");
            const response = await fetch(banner.url);
            const buffer = Buffer.from(await response.arrayBuffer());
            const base64 = buffer.toString("base64");
            const imageData = `data:${banner.contentType};base64,${base64}`;

            const patchResponse = await fetch("https://discord.com/api/v10/users/@me", {
                method: "PATCH",
                headers: {
                    Authorization: `Bot ${client.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ banner: imageData }),
            });

            if (patchResponse.ok) {
                await interaction.editReply({ content: "El banner ha sido cambiado con éxito" });
            } else {
                const errorData = await patchResponse.json();
                await interaction.editReply({ content: `Hubo un error al cambiar el banner: ${errorData.message}` });
            }
        } catch (error) {
            await interaction.editReply({ content: `Error: ${error.message}` });
        }
    }
};