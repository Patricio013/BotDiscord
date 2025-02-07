const { SlashCommandBuilder } = require('discord.js');
const schedule = require('node-schedule');
const moment = require('moment-timezone');
const Reminder = require('../../Modelos/reminder');
const UserSettings = require('../../Modelos/userSettingReminder');

module.exports = {
    name: "recordatorio_general",
    data: new SlashCommandBuilder()
        .setName('recordatorio_general')
        .setDescription('Crea un recordatorio general.')
        .addStringOption(option =>
            option.setName('fecha_hora')
                .setDescription('Fecha y hora en formato YYYY-MM-DD HH:mm')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('mensaje')
                .setDescription('Mensaje del recordatorio')
                .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName('canal')
                .setDescription('Canal donde se enviará el recordatorio')
                .setRequired(true)
        )
        .addRoleOption(option =>
            option.setName('rol')
                .setDescription('Rol a mencionar en el recordatorio')
                .setRequired(true)
        ),

    async execute(client, interaction) {
        const fechaHora = interaction.options.getString('fecha_hora');
        const mensaje = interaction.options.getString('mensaje');
        const canal = interaction.options.getChannel('canal');
        const rol = interaction.options.getRole('rol');
        const userId = interaction.user.id;

        const userSettings = await UserSettings.findOne({ userId });
        const timezone = userSettings?.timezone || 'America/Argentina/Buenos_Aires';

        const fechaEnZona = moment.tz(fechaHora, 'YYYY-MM-DD HH:mm', timezone);
        if (!fechaEnZona.isValid() || fechaEnZona.toDate() < new Date()) {
            return interaction.reply({ 
                content: `⚠️ Fecha inválida o en el pasado. Usa el formato YYYY-MM-DD HH:mm en tu zona horaria (${timezone}).`, 
                ephemeral: true 
            });
        }

        const fechaUTC = fechaEnZona.utc();

        const nuevoRecordatorio = new Reminder({
            userId,
            text: mensaje,
            time: fechaUTC.toDate(),
            channelId: canal.id,
            roleId: rol.id
        });

        await nuevoRecordatorio.save();

        schedule.scheduleJob(fechaUTC.toDate(), async () => {
            const targetChannel = await client.channels.fetch(canal.id);
            if (targetChannel && targetChannel.isTextBased()) {
                await targetChannel.send({
                    content: `🔔 ${rol} ¡Recordatorio!: ${mensaje}`,
                    allowedMentions: { roles: [rol.id] }
                });

                await Reminder.findByIdAndDelete(nuevoRecordatorio._id);
            }
        });

        await interaction.reply({ 
            content: `✅ Recordatorio configurado para ${fechaHora} en el canal <#${canal.id}> mencionando a ${rol} en tu zona horaria (${timezone}).`, 
            ephemeral: true 
        });
    }
};