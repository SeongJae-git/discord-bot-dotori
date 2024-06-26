import { Events, ChannelType, ActionRowBuilder } from 'discord.js';
import { DISCORD_CHANNEL } from '../../configs/discord.channel.config.js';
import { hatchBtn } from './components/incubator.buttons.js';
import { incubatorGuideEmbed, insufficientDotoriEmbed, pickedItemEmbed, someErrorEmbed } from './components/incubator.embeds.js';
import CheckerUtil from '../../utils/checker.util.js';
import items from './repository/incubator.probability.table.json' assert { type: 'json' };
import { decreaseDotoriAndInsertLog, getDotoriByDiscordId } from './repository/incubator.repository.js';

export default class IncubatorCore {
    static guideMessageId = null;

    static async init(client) {
        // 부화기 1회당 드는 도토리 개수
        const incubatorRequireDotori = 100;
        //타켓채널 ID
        const targetChannel = await client.channels.fetch(DISCORD_CHANNEL.INCUBATOR);

        // 기존 메시지를 삭제하고 새 메시지 전송(재시작 시 최신화를 위함)
        if (targetChannel && targetChannel.type === ChannelType.GuildText) {
            const messages = await targetChannel.messages.fetch({ limit: 50 });
            const botMessage = messages.find((msg) => msg.author.id === client.user.id);
            if (botMessage) {
                await botMessage.delete();
            }
        }

        const buttons = new ActionRowBuilder().addComponents(hatchBtn);
        const incubatorGuideMessage = await targetChannel.send({
            embeds: [incubatorGuideEmbed],
            components: [buttons],
        });
        this.guideMessageId = incubatorGuideMessage.id;

        client.on(Events.InteractionCreate, async (interaction) => {
            // 부화기 사용 버튼 아니면 return;
            if (!CheckerUtil.isHatchBtn(interaction)) {
                return;
            }

            // 요청자 정보
            const discordId = interaction.user.id;
            const discordDisplayName = interaction.member.displayName;

            // 요청자 도토리 개수 조회
            const dotori = await getDotoriByDiscordId(discordId);

            // 도토리 부족할 시
            if (typeof dotori === 'undefined' || dotori < incubatorRequireDotori) {
                const insufficientEmbed = await insufficientDotoriEmbed(dotori);
                await interaction.reply({
                    embeds: [insufficientEmbed],
                    ephemeral: true,
                });
                return;
            }

            const pickedItem = await this.pickRandomItem();
            const result = await decreaseDotoriAndInsertLog({ discordId, incubatorRequireDotori, pickedItem });

            if (result) {
                const pickedEmbed = await pickedItemEmbed(discordDisplayName, pickedItem);

                // 이전 메시지가 있으면 삭제
                if (this.guideMessageId) {
                    const prevGuideMessage = await targetChannel.messages.fetch(this.guideMessageId).catch(() => null);
                    if (prevGuideMessage) await prevGuideMessage.delete();
                }

                // 뭐 뽑았는지 임베드 전송
                await targetChannel.send({
                    embeds: [pickedEmbed],
                });

                // 가이드 임베드,버튼 맨 아래로 내려오도록 안내 재전송
                const guideMessageAfterHatch = await targetChannel.send({
                    embeds: [incubatorGuideEmbed],
                    components: [buttons],
                });
                this.guideMessageId = guideMessageAfterHatch.id;
            } else {
                await interaction.reply({
                    embeds: [someErrorEmbed],
                    ephemeral: true,
                });
            }

            return;
        });
    }

    static async pickRandomItem() {
        // 누적 확률을 계산하기 위한 배열 생성
        const cumulativeProbabilities = [];

        // 누적 확률 배열 생성
        let cumulativeProbability = 0;
        for (const item of items) {
            cumulativeProbability += item.probability;
            cumulativeProbabilities.push(cumulativeProbability);
        }

        // 0부터 누적 확률의 최대 값 사이의 난수 생성
        const random = Math.random() * cumulativeProbability;

        // 랜덤한 아이템 선택
        for (let i = 0; i < items.length; i++) {
            if (random < cumulativeProbabilities[i]) {
                return items[i];
            }
        }

        // 만약 여기까지 왔다면 아무 아이템도 선택되지 않은 경우이므로 마지막 아이템을 선택
        return items[items.length - 1];
    }
}
