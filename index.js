require('dotenv').config();

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

client.commands = new Collection();

// 📂 Cargar comandos
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (command.data && command.execute) {
        client.commands.set(command.data.name, command);
    }
}

// 🔥 Bot listo
client.once('ready', () => {
    console.log(`🔥 Bot encendido como ${client.user.tag}`);
});

// 🎯 Manejo de comandos
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`❌ Error en ${interaction.commandName}:`, error);

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: '❌ Hubo un error ejecutando este comando.',
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: '❌ Hubo un error ejecutando este comando.',
                ephemeral: true
            });
        }
    }
});

client.login(process.env.TOKEN);