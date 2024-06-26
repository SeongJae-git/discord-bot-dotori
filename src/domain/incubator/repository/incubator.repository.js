import { createPool } from 'mariadb';
import { mariaDBConfig } from '../../../configs/mariadb.config.js';

const pool = createPool(mariaDBConfig);

async function getDotoriByDiscordId(discordId) {
    let conn, rows;

    try {
        conn = await pool.getConnection();

        [rows] = await conn.query(
            `
            SELECT dotori FROM user WHERE discord_id = ?
            `,
            [discordId]
        );
    } catch (error) {
        console.error(error);
    } finally {
        if (conn) {
            conn.release();
        }
    }

    const dotori = rows && typeof rows.dotori !== 'undefined' ? rows.dotori : 0;

    return dotori;
}

async function decreaseDotoriAndInsertLog(data) {
    let conn, rows;

    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();

        await conn.query(
            `
            INSERT INTO incubator_log (discord_id, item)
            VALUES (?, ?)
            `,
            [data.discordId, data.pickedItem.name]
        );

        rows = await conn.query(
            `
            UPDATE user SET dotori = dotori - ? WHERE discord_id = ?
        `,
            [data.incubatorRequireDotori, data.discordId]
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

    return rows ? rows : null;
}

export { getDotoriByDiscordId, decreaseDotoriAndInsertLog };
