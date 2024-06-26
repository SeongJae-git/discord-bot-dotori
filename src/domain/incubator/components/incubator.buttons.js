import { ButtonBuilder, ButtonStyle } from 'discord.js';

const hatchBtn = new ButtonBuilder().setCustomId('hatchBtn').setLabel(`부화기 사용 (도토리 100개 소모)`).setStyle(ButtonStyle.Primary);

export { hatchBtn };
