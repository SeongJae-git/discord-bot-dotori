import { ActionRowBuilder, ChannelType, Events } from 'discord.js';
import { DISCORD_CHANNEL } from '../../configs/discord.channel.config.js';
import { getCreateSessionForm, getDiceProcessingForm } from './components/dice.assembler.js';
import CheckerUtil from '../../utils/checker.util.js';
import { createDiceSessionBtn } from './components/dice.buttons.js';
import { allRolledEmbed, diceClosedSessionEmbed, diceGuideEmbed } from './components/dice.embeds.js';

export default class DiceCore {
    static session = null;

    // 최근 50개의 메시지 중 최대 1개의 봇 메시지 삭제
    static async #deleteTwoMessages(client, targetChannel) {
        if (targetChannel && targetChannel.type === ChannelType.GuildText) {
            const messages = await targetChannel.messages.fetch({ limit: 50 });
            // messages를 필터링하고 배열로 변환
            const botMessages = Array.from(messages.filter((msg) => msg.author.id === client.user.id).values()).slice(
                0,
                1
            );

            for (const botMessage of botMessages) {
                await botMessage.delete();
            }
        }
    }

    static async init(client) {
        const targetChannel = await client.channels.fetch(DISCORD_CHANNEL.DICE);

        await this.#deleteTwoMessages(client, targetChannel);

        const guideButton = new ActionRowBuilder().addComponents(createDiceSessionBtn);
        await targetChannel.send({
            embeds: [diceGuideEmbed],
            components: [guideButton]
        });

        client.on(Events.InteractionCreate, async (interaction) => {
            // 세션 생성 버튼 클릭
            if (CheckerUtil.isDiceCreateBtn(interaction)) {
                const sessionForm = await getCreateSessionForm(interaction.member.displayName);

                await this.#deleteTwoMessages(client, targetChannel);

                this.session = await targetChannel.send(sessionForm);

                await interaction.deferUpdate();
                return;
            }
            // 참가 버튼 클릭
            else if (CheckerUtil.isDiceJoinBtn(interaction)) {
                const user = interaction.member.displayName;
                const embeds = this.session.embeds;
                const partipants = embeds[0].data.fields[0].value.split(',').map((p) => p.trim());

                // 최대참가인원 도달
                if (partipants.length >= 24) {
                    await interaction.reply({
                        content: '```최대 참가인원을 초과하여 분배에 참여할 수 없습니다.```',
                        ephemeral: true
                    });
                    return;
                }

                // 이미 참가한사람
                if (partipants.includes(user)) {
                    await interaction.reply({
                        content: '```이미 참가하였습니다.```',
                        ephemeral: true
                    });
                    return;
                }

                if (embeds[0].data.fields[0].value === '\u200b') {
                    embeds[0].data.fields[0].value = user;
                } else {
                    embeds[0].data.fields[0].value += `, ${user}`;
                }

                await this.session.edit({
                    embeds: embeds,
                    contents: this.session.components
                });

                await interaction.deferUpdate();
                return;
            }
            // 탈퇴 버튼 클릭
            else if (CheckerUtil.isDiceLeaveBtn(interaction)) {
                const user = interaction.member.displayName;
                const embeds = this.session.embeds;
                let participants = embeds[0].data.fields[0].value.split(',').map((p) => p.trim());

                // 참가자 목록에 없을 때
                if (!participants.includes(user)) {
                    await interaction.reply({
                        content: '```이미 분배 참가자 목록에 없습니다.```',
                        ephemeral: true
                    });
                    return;
                }

                // 참가자 제거
                participants = participants.filter((p) => p !== user);

                if (participants.length === 0) {
                    embeds[0].data.fields[0].value = '\u200b';
                } else {
                    embeds[0].data.fields[0].value = participants.join(', ');
                }

                await this.session.edit({
                    embeds: embeds,
                    contents: this.session.components
                });

                await interaction.deferUpdate();
                return;
            }
            // 모집 마감 버튼 클릭
            else if (CheckerUtil.isDiceDeadlineBtn(interaction)) {
                const embeds = this.session.embeds;
                const participants = embeds[0].data.fields[0].value.split(',').map((p) => p.trim());

                // 참가자가 한명일 때 리턴처리
                if (participants.length < 2) {
                    await interaction.reply({
                        content:
                            '```두 명 이상의 참가자가 필요합니다.\n문제가 생겼다면, [분배 중지] 버튼을 눌러주세요.```',
                        ephemeral: true
                    });
                    return;
                }

                const diceProcessingForm = await getDiceProcessingForm(interaction.member.displayName, participants);

                await this.#deleteTwoMessages(client, targetChannel);

                this.session = await targetChannel.send(diceProcessingForm);

                await interaction.deferUpdate();
                return;
            }
            // 주사위 던지기 클릭
            else if (CheckerUtil.isDiceThrowBtn(interaction)) {
                const embeds = this.session.embeds;
                const fields = embeds[0].data.fields;
                const matched = fields.find((item) => item.name === interaction.member.displayName);

                if (!matched) {
                    await interaction.reply({
                        content:
                            '```분배 모집 시 참가한 인원이 아닙니다.\n해당 분배를 모집한 파티장에게 문의하세요.```',
                        ephemeral: true
                    });
                    return;
                }

                if (matched.value !== '\u200b') {
                    await interaction.reply({
                        content: '```이미 주사위를 굴렸습니다.\n또 굴리면 반칙이죠!```',
                        ephemeral: true
                    });
                    return;
                }

                // 중복되지 않는 randomInt 값 생성
                let randomInt;
                do {
                    randomInt = Math.floor(Math.random() * 100) + 1;
                } while (fields.some((item) => item.value == randomInt));

                matched.value = randomInt;

                // 모두 다 굴렸으면 결과 임베드 마지막에 추가
                const allRolled = fields.every((item) => item.value !== '\u200b');
                if (allRolled) {
                    const embed = await allRolledEmbed(embeds[0].data.fields);
                    embeds.push(embed);

                    this.session.components.forEach((row) => {
                        row.components = row.components.filter((component) => component.customId !== 'throwDiceBtn');
                    });
                }

                await this.session.edit({
                    embeds: embeds,
                    components: this.session.components
                });

                await interaction.deferUpdate();

                return;
            }
            // 분배 중지 or 종료 클릭
            else if (CheckerUtil.isDiceAbortBtn(interaction)) {
                // 기존 메시지 지우고
                await this.#deleteTwoMessages(client, targetChannel);

                // 혹시모를 저장해둔 채팅도 비우고
                this.session = null;

                // 이 세션은 ~로부터 종료되었습니다 전송
                const closeEmbed = await diceClosedSessionEmbed(interaction.member.displayName);
                await targetChannel.send({
                    embeds: [closeEmbed]
                });

                // 5초 뒤 초기화
                setTimeout(async () => {
                    await this.#deleteTwoMessages(client, targetChannel);
                    await targetChannel.send({
                        embeds: [diceGuideEmbed],
                        components: [guideButton]
                    });
                }, 5000);

                await interaction.deferUpdate();
                return;
            }
        });
    }
}
