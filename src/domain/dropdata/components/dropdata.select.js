// 결과값 여러개일 때 셀렉트메뉴 컴포넌트 생성용

import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';

async function selectList(searchKind, data) {
    const list = new StringSelectMenuBuilder()
        .setCustomId('dropdata-select')
        .setMaxValues(1)
        .addOptions(data.map((item) => new StringSelectMenuOptionBuilder().setLabel(`${item.name} (${item.id})`).setValue(`${searchKind}-=-${item.name}-=-${item.id}`)));

    return list;
}

export { selectList };
