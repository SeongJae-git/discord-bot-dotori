import { EmbedBuilder } from 'discord.js';

// 부화기 가이드 임베드
const incubatorGuideEmbed = new EmbedBuilder()
    .setColor('#3498DB')
    .setTitle('🐣   프리미엄 부화기')
    .setDescription(
        `올드서버 확률공개의 데이터들을 기반으로 한 부화기 뽑기입니다.\n부화기 1회 사용 당 100 도토리가 소모됩니다!`
    )
    .setFooter({
        text: `※ 자세한 확률표는 올드서버 디스코드의 '확률공개' 탭을 확인해주세요 ※`
    });

// 무언가 오류 임베드
const someErrorEmbed = new EmbedBuilder().setColor('#ED4245').setTitle(`❌   오류가 발생했습니다.`);

// 도토리 보유량 부족 임베드
const insufficientDotoriEmbed = async (dotori) => {
    const embed = new EmbedBuilder()
        .setColor('#ED4245')
        .setTitle('❌   도토리가 부족합니다!')
        .setDescription(`현재 보유중인 도토리는 ${dotori}개 입니다.`);

    return embed;
};

// 뽑았습니다 임베드
const pickedItemEmbed = async (displayName, item) => {
    const embed = new EmbedBuilder();
    embed.setTitle(`${displayName}님이 부화기에서 아이템을 뽑았습니다!\n[ ${item.icon} ${item.name} ]`);

    switch (item.rare) {
        case 1: {
            embed.setColor('#F1C40F'); // 골드
            break;
        }
        case 2: {
            embed.setColor('#9B59B6'); // 퍼플
            break;
        }
        case 3: {
            embed.setColor('#FFFFFF'); // 화이트
            break;
        }
        case 4: {
            embed.setColor('#BCC0C0'); // 라이트그레이
            break;
        }
        default: {
            embed.setColor('#000000'); // 그레이
            break;
        }
    }

    return embed;
};

export { incubatorGuideEmbed, someErrorEmbed, insufficientDotoriEmbed, pickedItemEmbed };
