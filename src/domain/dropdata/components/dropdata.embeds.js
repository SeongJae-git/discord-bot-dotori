import { EmbedBuilder } from 'discord.js';

// 드랍데이터 검색 안내메시지 임베드
const descEmbed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('🖥️  도토리 드랍데이터 검색')
    .setFooter({
        text: `Data based on Reflex 95(+OLD 65)`,
    })
    .setDescription(`※ 드랍률 1배 기준 데이터입니다. ※\n\n오류패치로 삭제된 아이템들은 알고 있는 선에서 제외하긴 했지만,\n실제 드랍데이터와는 일부 차이가 있을 수 있습니다.`);

// 검색 결과 없음 임베드
const notFoundEmbed = new EmbedBuilder().setColor('#ED4245').setTitle('검색 결과 없음!').setDescription(`검색 결과가 없습니다.`);

// 검색 결과 1~25개 임베드
const manyResultEmbed = new EmbedBuilder().setColor('#ED4245').setDescription(`검색된 결과가 2개 이상입니다. 정확한 대상을 선택해주세요.`);

// 검색 결과 25개 초과 임베드
const tooManyResultEmbed = new EmbedBuilder().setColor('#ED4245').setDescription(`검색된 결과가 너무 많습니다. 범위를 좁혀 다시 검색해주세요.`);

// 검색 데이터 개수 임베드 10개분 초과할 시 에러방지용
const tooManyDataEmbed = new EmbedBuilder().setColor('#ED4245').setDescription(`조회되는 드랍데이터가 240개 이상으로 비정상적으로 많아 검색할 수 없습니다.`);

// 검색 결과 임베드
const createSearchResultEmbed = async (target, dropData) => {
    const embedColor = '#0099ff';
    const embedTitle = `🔍  ${target.name} (${target.id}) 의 드랍데이터입니다.`;

    // 최대 필드 개수 제한
    const maxFieldsPerEmbed = 24;

    // 임베드를 담을 배열
    const embeds = [];

    // 드랍 데이터를 필드로 추가
    for (let i = 0; i < dropData.length; i += maxFieldsPerEmbed) {
        const currentFields = dropData.slice(i, i + maxFieldsPerEmbed).map((el) => ({
            name: `${el.name}`,
            value: `- ${el.chance / 10000}%`,
            inline: true,
        }));

        // EmbedBuilder로 임베드 생성
        const resultEmbed = new EmbedBuilder()
            .setColor(embedColor)
            .addFields(currentFields)
            .setTitle(`${embedTitle} [ ${parseInt(i / maxFieldsPerEmbed, 10) + 1}/${parseInt(dropData.length / maxFieldsPerEmbed, 10) + 1} 페이지 ]`);

        while (resultEmbed.data.fields.length % 3 !== 0) {
            resultEmbed.addFields({ name: '\u200b', value: '\u200b', inline: true });
        }

        embeds.push(resultEmbed);
    }

    return embeds;
};

export { descEmbed, notFoundEmbed, manyResultEmbed, tooManyResultEmbed, tooManyDataEmbed, createSearchResultEmbed };
