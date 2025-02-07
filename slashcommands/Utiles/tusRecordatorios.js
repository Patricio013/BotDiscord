const { SlashCommandBuilder } = require('discord.js');
const Reminder = require('../../Modelos/reminder');

module.exports = {
    name: 'tusrecordatorios',
    data: new SlashCommandBuilder()
        .setName('tusrecordatorios')
        .setDescription('Muestra todos tus recordatorios pendientes'),

    async execute(client, interaction) {
        const userId = interaction.user.id;
        const recordatorios = await Reminder.find({ userId });

        if (recordatorios.length === 0) {
            return interaction.reply({ content: '📋 No tienes recordatorios pendientes.', ephemeral: true });
        }

        const lista = recordatorios
            .map((r, index) => `${index + 1}. **${r.text}** - 🗓️ ${r.time.toLocaleString()}`)
            .join('\n');

        return interaction.reply({ content: `📋 Tus recordatorios:\n\n${lista}`, ephemeral: true });
    }
};