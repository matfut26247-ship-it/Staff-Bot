const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unblacklist')
        .setDescription('Quitar usuario de blacklist')
        .addUserOption(option =>
            option.setName('usuario').setDescription('Usuario').setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getUser('usuario');

        let data = JSON.parse(fs.readFileSync('./blacklist.json'));

        data = data.filter(id => id !== user.id);

        fs.writeFileSync('./blacklist.json', JSON.stringify(data, null, 2));

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('✅ BLACKLIST REMOVIDA')
            .setDescription(`${user} ha sido removido de blacklist`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};