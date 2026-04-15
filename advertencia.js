const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('advertencia')
        .setDescription('Advertencia leve')
        .addUserOption(option =>
            option.setName('usuario').setDescription('Usuario').setRequired(true))
        .addStringOption(option =>
            option.setName('motivo').setDescription('Motivo').setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        const motivo = interaction.options.getString('motivo');

        const embed = new EmbedBuilder()
            .setColor('Yellow')
            .setTitle('⚠️ ADVERTENCIA')
            .setDescription(`**Usuario:** ${user}\n**Motivo:** ${motivo}`)
            .setFooter({ text: `Staff: ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};