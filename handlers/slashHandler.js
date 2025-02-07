const { readdirSync, statSync} = require('node:fs');
const path = require("node:path");

module.exports = {
    async loadSlash(client) {
        const slashPath = path.join(__dirname, "../slashcommands");

        for (const category of readdirSync(slashPath)) {
            const categoryPath = path.join(slashPath, category);

            if (!statSync(categoryPath).isDirectory()) continue;

            for (const fileName of readdirSync(categoryPath).filter((file) => file.endsWith(".js"))) {
                const commandPath = path.join(categoryPath, fileName);

                const command = require(commandPath);

                if (!command.name) {
                    console.warn(`El archivo ${fileName} no tiene un campo "name".`);
                    continue;
                }

                client.slashCommands.set(command.data.name, command);
            }
        }

        if (client.slashCommands.size === 0) {
            console.warn("No se encontraron comandos para cargar.");
        } else {
            await client.application?.commands.set(client.slashCommands.map((x) => x.data.toJSON()));
            console.log(`Se han cargado ${client.slashCommands.size} comandos.`);
        }
    },
};