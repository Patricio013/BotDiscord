const { SlashCommandBuilder } = require('discord.js');
const Reminder = require('../../Modelos/reminder');

module.exports = {
    name: 'cancelarrecordatorio',
    data: new SlashCommandBuilder()
        .setName('cancelarrecordatorio')
        .setDescription('Elimina un recordatorio pendiente')
        .addIntegerOption(option =>
            option.setName('id')
                .setDescription('ID del recordatorio (ver con /listar_recordatorios)')
                .setRequired(true)
        ),

    async execute(client, interaction) {
        const id = interaction.options.getInteger('id') - 1;
        const userId = interaction.user.id;

        const recordatorios = await Reminder.find({ userId });
        if (id < 0 || id >= recordatorios.length) {
            return interaction.reply({ content: '⚠️ ID de recordatorio inválido.', ephemeral: true });
        }

        const recordatorio = recordatorios[id];
        await Reminder.findByIdAndDelete(recordatorio._id);

        return interaction.reply({ content: `✅ Recordatorio eliminado: **${recordatorio.text}**`, ephemeral: true });
    }
};