import { ButtonBuilder, ButtonStyle } from 'discord.js';

// 아이템 드랍 검색 버튼
const itemDropInfoBtn = new ButtonBuilder().setCustomId('itemDropInfoBtn').setLabel('아이템드랍검색').setStyle(ButtonStyle.Primary);

// 몬스터 드랍 검색 버튼
const mobDropInfoBtn = new ButtonBuilder().setCustomId('mobDropInfoBtn').setLabel('몬스터드랍검색').setStyle(ButtonStyle.Primary);

export { itemDropInfoBtn, mobDropInfoBtn };
