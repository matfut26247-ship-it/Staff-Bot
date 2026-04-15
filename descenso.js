const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('descenso')
        .setDescription('Descender staff')
        .addUserOption(option =>
            option.setName('staff')
                .setDescription('Usuario a descender')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('rango_anterior')
                .setDescription('Rango anterior')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('nuevo_rango')
                .setDescription('Nuevo rango')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('Motivo del descenso')
                .setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getUser('staff');
        const rangoAnterior = interaction.options.getRole('rango_anterior');
        const nuevoRango = interaction.options.getRole('nuevo_rango');
        const motivo = interaction.options.getString('motivo');

        const member = await interaction.guild.members.fetch(user.id);

        // 🔒 VALIDACIONES
        if (!member) {
            return interaction.reply({ content: '❌ Usuario no encontrado.', ephemeral: true });
        }

        if (!member.roles.cache.has(rangoAnterior.id)) {
            return interaction.reply({ content: '❌ El usuario no tiene ese rango.', ephemeral: true });
        }

        // 🔥 FIRMA
        const firma = interaction.member.roles.highest;

        // 🔥 CAMBIO
        await member.roles.remove(rangoAnterior);
        await member.roles.add(nuevoRango);

        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('📉 FORMATO OFICIAL DE DESCENSO')
            .setDescription(
`━━━━━━━━━━━━━━━━━━━━━━
👮 **ALTO MANDO:** ${interaction.user}

👤 **STAFF:** ${user}

📈 **RANGO ANTERIOR:** ${rangoAnterior}
📉 **NUEVO RANGO:** ${nuevoRango}

📝 **MOTIVO:**
${motivo}

✍️ **FIRMA:** ${firma}
━━━━━━━━━━━━━━━━━━━━━━
Sistema Administrativo`
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};