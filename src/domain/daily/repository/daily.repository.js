import { createPool } from 'mariadb';
import { mariaDBConfig } from '../../../configs/mariadb.config.js';

const pool = createPool(mariaDBConfig);

async function insertUser(data) {
    let conn, rows;

    try {
        conn = await pool.getConnection();
        rows = await conn.query(
            `
            INSERT INTO user (discord_id, discord_username, discord_displayname, dotori)
            VALUES (?, ?, ?, 0)
            `,
            [data.discordId, data.discordUsername, data.discordDisplayName]
        );
    } catch (error) {
        console.error(error);
    } finally {
        if (conn) {
            conn.release();
        }
        return rows;
    }
}

async function findUserByDiscordId(discordId) {
    let conn;

    try {
        conn = await pool.getConnection();

        const [rows] = await conn.query(`SELECT discord_id, dotori FROM user WHERE discord_id = ?`, [discordId]);

        return rows;
    } catch (error) {
        console.error(error);
    } finally {
        if (conn) {
            conn.release();
        }
    }
}

async function insertDaily(discordId) {
    let conn, rows;

    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();

        await conn.query(
            `
            INSERT INTO daily_log (discord_id)
            VALUES (?)
            `,
            [discordId]
        );

        await conn.query(
            `
            UPDATE user SET dotori = dotori + 1000 WHERE discord_id = ?
        `,
            [discordId]
        );

        rows = await conn.query(
            `
            SELECT dotori FROM user WHERE discord_id = ?
            `,
            [discordId]
        );

        await conn.commit();
    } catch (error) {
        await conn.rollback();
        console.error(error);
    } finally {
        if (conn) {
            conn.release();
        }
    }

    return rows && rows.length > 0 ? rows[0].dotori : null;
}

async function findTodayDailyByDiscordId(discordId) {
    let conn, rows;

    try {
        conn = await pool.getConnection();
        rows = await conn.query(`SELECT discord_id FROM daily_log WHERE discord_id = ? AND DATE(createdAt) = CURDATE()`, [discordId]);
    } catch (error) {
        console.error(error);
    } finally {
        if (conn) {
            conn.release();

            return rows;
        }
    }
}

export { insertUser, insertDaily, findUserByDiscordId, findTodayDailyByDiscordId };
