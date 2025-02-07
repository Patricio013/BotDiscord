const { SlashCommandBuilder } = require('discord.js');
const moment = require('moment-timezone');
const UserSettings = require('../../Modelos/userSettingReminder');

module.exports = {
    name: 'settimezone',
    data: new SlashCommandBuilder()
        .setName('settimezone')
        .setDescription('Configura tu zona horaria')
        .addStringOption(option =>
            option.setName('zona_horaria')
                .setDescription('Ejemplo: UTC, America/Mexico_City, Europe/Madrid')
                .setRequired(true)
        ),

    async execute(client, interaction) {
        const timezone = interaction.options.getString('zona_horaria');
        const userId = interaction.user.id;

        // Validar la zona horaria
        if (!moment.tz.zone(timezone)) {
            return interaction.reply({ content: '⚠️ Zona horaria inválida. Asegúrate de usar un nombre válido como "America/Montevideo".', ephemeral: true });
        }

        // Guardar en la base de datos
        await UserSettings.findOneAndUpdate(
            { userId },
            { timezone },
            { upsert: true }
        );

        return interaction.reply({ content: `✅ Zona horaria configurada a: **${timezone}**`, ephemeral: true });
    }
};