import { Events, ActionRowBuilder, ChannelType } from 'discord.js';
import { itemDropInfoBtn, mobDropInfoBtn } from './components/dropdata.buttons.js';
import { descEmbed, notFoundEmbed, manyResultEmbed, tooManyResultEmbed, createSearchResultEmbed, tooManyDataEmbed } from './components/dropdata.embeds.js';
import { inputModal } from './components/dropdata.modals.js';
import { selectList } from './components/dropdata.select.js';
import { getMobIdByMobName, getMobDropData, getItemDropData, getItemIdByItemName, insertLog } from './repository/dropdata.repository.js';
import { DISCORD_CHANNEL } from '../../configs/discord.channel.config.js';
import CheckerUtil from '../../utils/checker.util.js';

export default class DropDataCore {
    static async init(client) {
        // 답장 수정용 임시 인스턴스
        let tempMessageInst;

        // 소켓 이벤트 초기화 먼저
        client.on(Events.InteractionCreate, async (interaction) => {
            // 버튼 클릭 상호작용
            if (CheckerUtil.isDropdataBtn(interaction)) {
                const modal = await inputModal(interaction.customId);

                await interaction.showModal(modal);
            }
            // 모달창 submit 상호작용
            else if (CheckerUtil.isDropdataSubmitModal(interaction)) {
                const searchKind = interaction.fields.fields.has('mobInput') ? 'mobInput' : 'itemInput';
                const input = interaction.fields.getTextInputValue(searchKind);

                // 검색로그 삽입
                await insertLog({
                    discord_id: interaction.user.id,
                    discord_username: interaction.user.username,
                    discord_displayName: interaction.member.displayName,
                    search_kind: searchKind === 'mobInput' ? 'mob' : 'item',
                    search_input: input,
                });
                // 검색결과 불러오기
                const dbResult = searchKind === 'mobInput' ? await getMobIdByMobName(input) : await getItemIdByItemName(input);

                // Discord.js의 SelectList 컴포넌트가 최대 25개로 제한되어있음
                if (dbResult.length > 25) {
                    await interaction.reply({
                        embeds: [tooManyResultEmbed],
                        ephemeral: true,
                    });
                }
                // 1~25개는 그냥 리스트로 출력해줌
                else if (dbResult.length > 1) {
                    const selectRow = new ActionRowBuilder().addComponents(await selectList(searchKind, dbResult));

                    tempMessageInst = await interaction.reply({
                        embeds: [manyResultEmbed],
                        components: [selectRow],
                        ephemeral: true,
                    });
                }
                // 정확히 일치하는 한 개의 결과값은 바로 자세히 표시해주고, 결과없으면 없음 임베드 전송
                else {
                    let embedArr = [];

                    if (dbResult === undefined || dbResult.length === 0) {
                        embedArr.push(notFoundEmbed);
                    } else {
                        const dropData = searchKind === 'mobInput' ? await getMobDropData(dbResult[0].id) : await getItemDropData(dbResult[0].id);

                        embedArr = await createSearchResultEmbed(dbResult[0], dropData);
                    }

                    await interaction.reply({
                        embeds: embedArr,
                        ephemeral: true,
                    });
                }
            }
            // 셀렉트창(검색결과 여러개일 시 한개 선택완료 이벤트) 상호작용
            else if (CheckerUtil.isDropdataStringSelectMenu(interaction)) {
                const values = interaction.values[0].split('-=-');

                const searchKind = values[0];
                const name = values[1];
                const id = values[2];

                const dropData = searchKind === 'mobInput' ? await getMobDropData(id) : await getItemDropData(id);

                await interaction.update({
                    components: [],
                });

                if (dropData.length > 240) {
                    const embed = tooManyDataEmbed;

                    await tempMessageInst.edit({
                        embeds: [embed],
                        ephemeral: true,
                    });
                } else {
                    const embedArr = await createSearchResultEmbed({ name, id }, dropData);

                    if (embedArr.length === 0) {
                        embedArr.push(notFoundEmbed);
                    }

                    await tempMessageInst.edit({
                        embeds: embedArr,
                        ephemeral: true,
                    });
                }
            }
        });

        // 소켓 이벤트 초기화 후 기존 메시지를 삭제하고 새 버튼 전송
        const targetChannel = await client.channels.fetch(DISCORD_CHANNEL.DROPDATA);
        if (targetChannel && targetChannel.type === ChannelType.GuildText) {
            const messages = await targetChannel.messages.fetch({ limit: 100 });
            const botMessages = messages.filter((msg) => msg.author.id === client.user.id);
            for (const msg of botMessages.values()) {
                await msg.delete();
            }
        }

        const buttons = new ActionRowBuilder().addComponents(itemDropInfoBtn, mobDropInfoBtn);
        await targetChannel.send({
            embeds: [descEmbed],
            components: [buttons],
        });
    }
}
