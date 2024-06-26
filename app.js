import { Client, IntentsBitField } from 'discord.js';
import DropDataCore from './src/domain/dropdata/dropdata.core.js';
import DailyCore from './src/domain/daily/daily.core.js';
import IncubatorCore from './src/domain/incubator/incubator.core.js';
import { config as dotenvConfig } from 'dotenv';
import { DISCORD_CHANNEL } from './src/configs/discord.channel.config.js';
import DiceCore from './src/domain/dice/dice.core.js';
dotenvConfig();

const client = new Client({
    intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent]
});

client.once('ready', async () => {
    await Promise.all([
        DiceCore.init(client),
        DropDataCore.init(client),
        DailyCore.init(client),
        IncubatorCore.init(client)
    ]);

    // 봇 상태 등 설정
    client.user.setActivity(`열심히 도토리 수집`);

    const initMsg = `${client.user.tag} is successfuly initalized at ${new Date()}`;
    const initChannel = await client.channels.fetch(DISCORD_CHANNEL.INITLOG);

    await initChannel.send({
        content: initMsg
    });
    console.log(initMsg);
});

await client.login(process.env.BOT_TOKEN);

// pm2 start app.js --name 'doroti-bot'
