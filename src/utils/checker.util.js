export default class CheckerUtil {
    static isDropdataBtn(interaction) {
        return (
            interaction.isButton() &&
            (interaction.customId === 'itemDropInfoBtn' || interaction.customId === 'mobDropInfoBtn')
        );
    }

    static isDropdataSubmitModal(interaction) {
        return interaction.isModalSubmit() && interaction.customId === 'dropdataModal'; // && (interaction.customId === 'itemInput' || interaction.customId === 'mobInput');
    }

    static isDropdataStringSelectMenu(interaction) {
        return interaction.isStringSelectMenu() && interaction.customId === 'dropdata-select';
    }

    static isDailyBtn(interaction) {
        return interaction.isButton() && interaction.customId === 'dailyBtn';
    }

    static isHatchBtn(interaction) {
        return interaction.isButton() && interaction.customId === 'hatchBtn';
    }

    static isDiceCreateBtn(interaction) {
        return interaction.isButton() && interaction.customId === 'createDiceSessionBtn';
    }

    static isDiceJoinBtn(interaction) {
        return interaction.isButton() && interaction.customId === 'joinDiceSessionBtn';
    }

    static isDiceLeaveBtn(interaction) {
        return interaction.isButton() && interaction.customId === 'leaveDiceSessionBtn';
    }

    static isDiceDeadlineBtn(interaction) {
        return interaction.isButton() && interaction.customId === 'deadlineSessionBtn';
    }

    static isDiceAbortBtn(interaction) {
        return interaction.isButton() && interaction.customId === 'abortDiceSessionBtn';
    }

    static isDiceThrowBtn(interaction) {
        return interaction.isButton() && interaction.customId === 'throwDiceBtn';
    }

    static isNull(v) {
        return v === 'undefined' || v === null || v === 0 || v === '';
    }
}
