import { ButtonBuilder, ButtonStyle } from 'discord.js';

const createDiceSessionBtn = new ButtonBuilder()
    .setCustomId('createDiceSessionBtn')
    .setStyle(ButtonStyle.Primary)
    .setLabel('새로운 분배 주사위 세션 생성');

const joinDiceSessionBtn = new ButtonBuilder()
    .setCustomId('joinDiceSessionBtn')
    .setStyle(ButtonStyle.Success)
    .setLabel('분배 참가');

const leaveDiceSessionBtn = new ButtonBuilder()
    .setCustomId('leaveDiceSessionBtn')
    .setStyle(ButtonStyle.Secondary)
    .setLabel('분배 탈퇴');

const deadlineSessionBtn = new ButtonBuilder()
    .setCustomId('deadlineSessionBtn')
    .setStyle(ButtonStyle.Primary)
    .setLabel('모집 마감');

const abortDiceSessionBtn = new ButtonBuilder()
    .setCustomId('abortDiceSessionBtn')
    .setStyle(ButtonStyle.Danger)
    .setLabel('분배 중지');

const throwDiceBtn = new ButtonBuilder()
    .setCustomId('throwDiceBtn')
    .setStyle(ButtonStyle.Success)
    .setLabel('주사위 던지기');

const endDiceSessionBtn = new ButtonBuilder()
    .setCustomId('abortDiceSessionBtn')
    .setStyle(ButtonStyle.Danger)
    .setLabel('분배 종료하기');

export {
    createDiceSessionBtn,
    abortDiceSessionBtn,
    joinDiceSessionBtn,
    leaveDiceSessionBtn,
    throwDiceBtn,
    deadlineSessionBtn,
    endDiceSessionBtn
};
