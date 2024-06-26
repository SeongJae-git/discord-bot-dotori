import { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } from 'discord.js';

const inputModal = async (btnInteractionId) => {
    const kindString = btnInteractionId === 'itemDropInfoBtn' ? '아이템' : '몬스터';

    const modal = new ModalBuilder().setCustomId('dropdataModal').setTitle(`${kindString} 드랍데이터 검색`);

    const input = new TextInputBuilder().setLabel('검색할 키워드를 입력하세요').setStyle(TextInputStyle.Short);
    kindString === '아이템' ? input.setCustomId('itemInput') : input.setCustomId('mobInput');

    const row = new ActionRowBuilder().addComponents(input);

    modal.addComponents(row);

    return modal;
};

export { inputModal };
