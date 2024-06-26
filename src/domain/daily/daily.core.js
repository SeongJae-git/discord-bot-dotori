import { ActionRowBuilder, Events, ChannelType } from 'discord.js';
import { DISCORD_CHANNEL } from '../../configs/discord.channel.config.js';
import { findUserByDiscordId, insertUser, insertDaily, findTodayDailyByDiscordId } from './repository/daily.repository.js';
import { dailyWelcomeEmbed, dailyPassEmbed, dailyDeniedEmbed } from './components/daily.embeds.js';
import { dailyBtn } from './components/daily.buttons.js';
import CheckerUtil from '../../utils/checker.util.js';

export default class DailyCore {
    static welcomeMessageId = null;

    static async init(client) {
        const targetChannel = await client.channels.fetch(DISCORD_CHANNEL.DAILY);

        // 기존 메시지를 삭제하고 새 메시지 전송(재시작 시 최신화를 위함)
        if (targetChannel && targetChannel.type === ChannelType.GuildText) {
            const messages = await targetChannel.messages.fetch({ limit: 50 });
            const botMessage = messages.find((msg) => msg.author.id === client.user.id);
            if (botMessage) {
                await botMessage.delete();
            }
        }

        const buttons = new ActionRowBuilder().addComponents(dailyBtn);
        const welcomeMessage = await targetChannel.send({
            embeds: [dailyWelcomeEmbed],
            components: [buttons],
        });
        this.welcomeMessageId = welcomeMessage.id;

        client.on(Events.InteractionCreate, async (interaction) => {
            // 출첵 버튼 아니면 return;
            if (!CheckerUtil.isDailyBtn(interaction)) {
                return;
            }

            // 요청자 정보
            const discordId = interaction.user.id;
            const discordUsername = interaction.user.username;
            const discordDisplayName = interaction.member.displayName;

            // 오늘자 출첵기록 조회
            const todayDailyData = await findTodayDailyByDiscordId(discordId);

            if (todayDailyData.length !== 0) {
                const embed = await dailyDeniedEmbed(discordDisplayName);
                interaction.reply({
                    embeds: [embed],
                    ephemeral: true,
                });
                return;
            }

            const user = await findUserByDiscordId(discordId);
            if (!user || user === null || user === undefined) {
                await insertUser({ discordId, discordUsername, discordDisplayName });
            }

            const myDotori = await insertDaily(discordId);

            // 이전 메시지가 있으면 삭제
            if (this.welcomeMessageId) {
                const prevWelcomeMessage = await targetChannel.messages.fetch(this.welcomeMessageId).catch(() => null);
                if (prevWelcomeMessage) await prevWelcomeMessage.delete();
            }
            // 출첵 완료 임베드 전송
            await targetChannel.send({
                embeds: [await dailyPassEmbed(discordDisplayName, myDotori)],
            });
            // 출첵버튼이랑 안내 재전송
            const welcomeMessageAfterDaily = await targetChannel.send({
                embeds: [dailyWelcomeEmbed],
                components: [buttons],
            });
            this.welcomeMessageId = welcomeMessageAfterDaily.id;
        });
    }
}
