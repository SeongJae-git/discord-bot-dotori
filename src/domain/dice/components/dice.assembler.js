import { ActionRowBuilder } from 'discord.js';
import { diceCreateEmbed, diceProcessingEmbed } from './dice.embeds.js';
import {
    abortDiceSessionBtn,
    deadlineSessionBtn,
    endDiceSessionBtn,
    joinDiceSessionBtn,
    leaveDiceSessionBtn,
    throwDiceBtn
} from './dice.buttons.js';

export async function getCreateSessionForm(creator) {
    const embed = await diceCreateEmbed(creator);
    const buttons = new ActionRowBuilder().addComponents(
        joinDiceSessionBtn,
        leaveDiceSessionBtn,
        deadlineSessionBtn,
        abortDiceSessionBtn
    );

    const form = {
        embeds: [embed],
        components: [buttons]
    };

    return form;
}

export async function getDiceProcessingForm(creator, participants) {
    const embed = await diceProcessingEmbed(creator, participants);
    const buttons = new ActionRowBuilder().addComponents(throwDiceBtn, endDiceSessionBtn);

    const form = {
        embeds: [embed],
        components: [buttons]
    };

    return form;
}
