const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../base de datos/notas.json');

function leerDB() {
    if (!fs.existsSync(dbPath)) return [];
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('historial')
        .setDescription('Ver historial de notas de un usuario')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuario a consultar')
                .setRequired(true)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        const db = leerDB();

        const notasUsuario = db.filter(n => n.usuarioId === user.id);

        if (notasUsuario.length === 0) {
            return interaction.reply({
                content: `❌ No hay notas para ${user.tag}`,
                ephemeral: true
            });
        }

        const descripcion = notasUsuario
            .map((n, i) =>
                `**#${i + 1}**
📝 ${n.contenido}
👮 Autor: ${n.autorTag}
📅 Fecha: <t:${Math.floor(new Date(n.fecha).getTime() / 1000)}:R>`
            )
            .join('\n\n');

        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle(`📜 HISTORIAL DE NOTAS`)
            .setDescription(descripcion)
            .setFooter({ text: `Usuario: ${user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};