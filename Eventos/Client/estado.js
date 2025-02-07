const { ActivityType } = require("discord.js")
const mongoose = require("mongoose")
const schedule = require("node-schedule");
const Reminder = require("../../Modelos/reminder");

module.exports = {
	name: "ready",
	once: true,

	async execute(client, interaction){

		await mongoose.connect((process.env.MONGODB), {
		}).then(() => {
			console.log("» |  Conectado a la base de datos")
		}).catch(err => {
			console.log("» | No Se puede conectar a la base de datos")
		})


		const recordatoriosPendientes = await Reminder.find({ time: { $gte: new Date() } });
        recordatoriosPendientes.forEach(recordatorio => {
			schedule.scheduleJob(recordatorio.time, async () => {
				if (recordatorio.channelId && recordatorio.roleId) {
					const channel = await client.channels.fetch(recordatorio.channelId);
					if (channel && channel.isTextBased()) {
						const roleMention = `<@&${recordatorio.roleId}>`;
						await channel.send({
							content: `🔔 ${roleMention} ¡Recordatorio!: ${recordatorio.text}`,
							allowedMentions: { roles: [recordatorio.roleId] }
						});
					}
				} else if (recordatorio.userId) {
					const user = await client.users.fetch(recordatorio.userId);
					if (user) {
						await user.send(`🔔 ¡Recordatorio!: ${recordatorio.text}`);
					}
				}

				await Reminder.findByIdAndDelete(recordatorio._id);
			});
		});


        console.log(`⏰ ${recordatoriosPendientes.length} recordatorios reprogramados.`);

		console.log("» | Estado cargado con exito")

	}
}