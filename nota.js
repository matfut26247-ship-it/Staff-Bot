const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../base de datos/notas.json');

function leerDB() {
    if (!fs.existsSync(dbPath)) return [];
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

function guardarDB(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nota')
        .setDescription('Agregar nota a un staff')
        .addUserOption(option =>
            option.setName('usuario').setDescription('Usuario').setRequired(true))
        .addStringOption(option =>
            option.setName('contenido').setDescription('Nota').setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        const contenido = interaction.options.getString('contenido');

        const db = leerDB();

        const nuevaNota = {
            id: Date.now(),
            usuarioId: user.id,
            usuarioTag: user.tag,
            autorId: interaction.user.id,
            autorTag: interaction.user.tag,
            contenido: contenido,
            fecha: new Date().toISOString()
        };

        db.push(nuevaNota);
        guardarDB(db);

        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('📝 NOTA STAFF')
            .addFields(
                { name: '👤 Usuario', value: `${user}`, inline: true },
                { name: '👮 Autor', value: `${interaction.user}`, inline: true },
                { name: '📄 Nota', value: contenido }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};