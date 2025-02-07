const { SlashCommandBuilder } = require('discord.js');
const schedule = require('node-schedule');
const moment = require('moment-timezone');
const Reminder = require('../../Modelos/reminder'); 
const UserSettings = require('../../Modelos/userSettingReminder');

module.exports = {
    name: "recordatorio_personal",
    data: new SlashCommandBuilder()
        .setName('recordatorio_personal')
        .setDescription('Crea un recordatorio para ti solo.')
        .addStringOption(option =>
            option.setName('fecha_hora')
                .setDescription('Fecha y hora en formato YYYY-MM-DD HH:mm')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('mensaje')
                .setDescription('Mensaje del recordatorio')
                .setRequired(true)
        ),

        async execute(client, interaction) {
            const fechaHora = interaction.options.getString('fecha_hora');
            const mensaje = interaction.options.getString('mensaje');
            const userId = interaction.user.id;
    
            const userSettings = await UserSettings.findOne({ userId });
            const timezone = userSettings?.timezone || 'America/Argentina/Buenos_Aires'
    
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
            });
    
            await nuevoRecordatorio.save();
    
            schedule.scheduleJob(fechaUTC.toDate(), async () => {
                const user = await interaction.client.users.fetch(userId);
                if (user) {
                    user.send(`🔔 ¡Recordatorio!: ${mensaje}`);
                    await Reminder.findByIdAndDelete(nuevoRecordatorio._id);
                }
            });
    
            await interaction.reply({ 
                content: `✅ Recordatorio configurado para ${fechaHora} en tu zona horaria (${timezone})`, 
                ephemeral: true 
            });
        }
    };
