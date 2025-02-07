const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder } = require("discord.js")
const { readdirSync } = require("node:fs")

module.exports = {

	async loadEvents(client){
		readdirSync(process.cwd()+"/Eventos").forEach((x) => {
			readdirSync(process.cwd()+`/Eventos/${x}`).filter(file => file.endsWith(".js")).forEach((y) => {
				const event = require(process.cwd()+`/Eventos/${x}/${y}`)
				if(event.once) client.once(event.name, (...args) => event.execute(...args, client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder)); else {
					client.on(event.name, (...args) => event.execute(...args, client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder))
				}
			})
		})
	}
}