import { Colors, EmbedBuilder } from 'discord.js';

const diceGuideEmbed = new EmbedBuilder()
    .setTitle('🎲  분배용 주사위 시스템입니다.')
    .setColor(Colors.Blue)
    .setDescription('보스, 이벤트 등 각종 상황에서 사용 가능한 주사위 시스템입니다.')
    .setFooter({
        text: '└ 최대 24인까지 참가 가능합니다.'
    });

const diceCreateEmbed = async (creator) => {
    const embed = new EmbedBuilder()
        .setTitle(`🎲  ${creator} 님이 생성한 주사위 분배 진행중`)
        .setColor(Colors.Green)
        .setDescription(
            '\u200b\n대상자들은 참가 버튼으로 참가하세요.\n파티장은 모두 참가한것이 확인되면 마감해주세요.\n\u200b'
        )
        .setFields({ name: '[ 참가자 ]', value: '\u200b' });

    return embed;
};

const diceProcessingEmbed = async (creator, participants) => {
    const embed = new EmbedBuilder()
        .setTitle(`🎲  ${creator} 님이 생성한 주사위 분배 진행중`)
        .setColor(Colors.Green)
        .setDescription(
            '\u200b\n주사위 던지기 버튼으로 주사위를 굴려주세요!\n1~100 사이의 숫자가 나오며, 이미 나온 숫자는 나오지 않습니다.\n\u200b'
        )
        .setFields(
            participants.map((user) => {
                const element = {
                    name: user,
                    value: '\u200b',
                    inline: true
                };

                return element;
            })
        );

    return embed;
};

const allRolledEmbed = async (data) => {
    data.sort((a, b) => b.value - a.value);

    const result = data.map((item) => item.name).join('   ㅡ   ');

    const embed = new EmbedBuilder()
        .setTitle(`🎲  주사위 결과 및 분배 순서입니다!`)
        .setColor(Colors.Green)
        .setDescription(result);

    return embed;
};

const diceClosedSessionEmbed = async (abortedBy) => {
    const embed = new EmbedBuilder()
        .setTitle(`🎲  ${abortedBy} 님에 의해 세션이 종료되었습니다.`)
        .setColor(Colors.Red)
        .setDescription('이 메시지는 5초 뒤 사라지며 모든 작업이 초기화됩니다.');

    return embed;
};

export { diceGuideEmbed, diceCreateEmbed, diceProcessingEmbed, diceClosedSessionEmbed, allRolledEmbed };
