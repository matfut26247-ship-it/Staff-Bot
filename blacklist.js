const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blacklist')
        .setDescription('Agregar a blacklist')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuario a blacklist')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('Motivo de la blacklist')
                .setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        const motivo = interaction.options.getString('motivo');

        let data = JSON.parse(fs.readFileSync('./blacklist.json'));

        if (!data.includes(user.id)) {
            data.push(user.id);
            fs.writeFileSync('./blacklist.json', JSON.stringify(data, null, 2));
        }

        const member = await interaction.guild.members.fetch(user.id);
        await member.ban({ reason: motivo });

        const embed = new EmbedBuilder()
            .setColor('#000000')
            .setTitle('🚫 BLACKLIST')
            .setDescription(`${user} fue añadido a blacklist\nMotivo: ${motivo}`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};