import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const DISCORD_CHANNEL = {
    INITLOG: process.env.TARGET_CHANNEL_INITLOG,
    DROPDATA: process.env.TARGET_CHANNEL_DROPDATA,
    DAILY: process.env.TARGET_CHANNEL_DAILY,
    INCUBATOR: process.env.TARGET_CHANNEL_INCUBATOR,
    DICE: process.env.TARGET_CHANNEL_DICE,
    CHAOSSCROLL: process.env.TARGET_CHANNEL_CHAOSSCROLL,
};

export { DISCORD_CHANNEL };
