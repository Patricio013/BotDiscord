const Discord = require('discord.js');
const { Client, Collection } = require('discord.js');
const client = new Client({intents: 53608447});
const { loadSlash} = require('./handlers/slashHandler')
const { loadEvents } = require("./handlers/eventHandler")
require('dotenv').config()
require('./handlers/distube')(client);

client.slashCommands = new Collection();

(async () => {
    await client
    .login(process.env.TOKEN)
    .catch((err) => 
        console.error(`» | Error al inciar el bot => ${err}`));
})();

loadEvents(client)
client.on("ready", async () => {
    await loadSlash(client)
    .then(() => {
        console.log("» | Comando cargados con exito");
    })
    //.catch((err) => 
    //    console.error(`» | Error al cargar los comandos => ${err}`));
    console.log(`» | Bot encendido con la cuenta de: ${client.user.tag}`)
})