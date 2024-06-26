import { ButtonBuilder, ButtonStyle } from 'discord.js';

const dailyBtn = new ButtonBuilder().setCustomId('dailyBtn').setLabel('오늘의 도토리 받기').setStyle(ButtonStyle.Primary);

export { dailyBtn };
