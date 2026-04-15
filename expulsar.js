const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('expulsar')
        .setDescription('Expulsar usuario')
        .addUserOption(option =>
            option.setName('usuario').setDescription('Usuario').setRequired(true))
        .addStringOption(option =>
            option.setName('motivo').setDescription('Motivo').setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        const motivo = interaction.options.getString('motivo');

        const member = await interaction.guild.members.fetch(user.id);

        await member.kick(motivo);

        const embed = new EmbedBuilder()
            .setColor('Orange')
            .setTitle('👢 USUARIO EXPULSADO')
            .setDescription(`${user} fue expulsado\n\nMotivo: ${motivo}`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};