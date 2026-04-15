require('dotenv').config();

const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];

// 📂 Ruta a la carpeta de comandos
const commandsPath = path.join(__dirname, 'commands');

// ❌ Validación: si no existe la carpeta
if (!fs.existsSync(commandsPath)) {
    console.error('❌ No existe la carpeta "commands"');
    process.exit(1);
}

// 🔍 Leer todos los archivos JS dentro de commands
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// ⚙ Cargar comandos
for (const file of commandFiles) {
    try {
        const command = require(`./commands/${file}`);

        if (!command.data) {
            console.log(`⚠️ ${file} no tiene data, ignorado`);
            continue;
        }

        const json = command.data.toJSON();
        commands.push(json);
        console.log(`✅ ${file} cargado correctamente`);
    } catch (error) {
        console.error(`❌ ERROR en ${file}`);
        console.error(error.message);
    }
}

// 🔗 Configuración del REST
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// 🚀 Deploy de comandos
(async () => {
    try {
        console.log('⏳ Subiendo comandos válidos...');

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands }
        );

        console.log('✅ Cargado Correctamente (solo comandos válidos).');
    } catch (error) {
        console.error('❌ Error global:', error);
    }
})();