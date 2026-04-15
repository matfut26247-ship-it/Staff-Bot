const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Eliminar mensajes')
        .addIntegerOption(option =>
            option.setName('cantidad')
                .setDescription('Cantidad de mensajes')
                .setRequired(true)),

    async execute(interaction) {
        const cantidad = interaction.options.getInteger('cantidad');

        await interaction.channel.bulkDelete(cantidad, true);

        await interaction.reply({
            content: `🧹 ${cantidad} mensajes eliminados.`,
            ephemeral: true
        });
    }
};