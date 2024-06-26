import { EmbedBuilder } from 'discord.js';

// 출첵 채널 입장 시 메시지 임베드
const dailyWelcomeEmbed = new EmbedBuilder().setColor('#3498DB').setTitle('🐿️   출석체크').setDescription(`오늘도 열심히 도토리를 모으러 와주셨군요!\n출석체크 완료 시 1,000개의 도토리가 지급됩니다.`);

// 출석체크 완료 임베드
const dailyPassEmbed = async (displayName, dotori) => {
    return new EmbedBuilder()
        .setColor('#57F287')
        .setTitle(`🐿️   ${displayName}님 출석체크 완료!`)
        .setDescription(`도토리 1,000개를 성공적으로 받았습니다!\n현재 보유중인 도토리는 ${dotori.toLocaleString()}개에요!`);
};

// 출석체크 거절 임베드
const dailyDeniedEmbed = async (displayName) => {
    return new EmbedBuilder().setColor('#ED4245').setTitle(`🐿️   ${displayName}님 출석체크 실패!`).setDescription(`오늘은 이미 출석체크를 해서 도토리를 받아가셨어요.`);
};

export { dailyWelcomeEmbed, dailyPassEmbed, dailyDeniedEmbed };
