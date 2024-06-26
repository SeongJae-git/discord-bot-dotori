import { createPool } from 'mariadb';
import { mariaDBConfig } from '../../../configs/mariadb.config.js';

const pool = createPool(mariaDBConfig);

async function insertLog(data) {
    let conn, rows;

    try {
        conn = await pool.getConnection();
        rows = await conn.query(
            `
            INSERT INTO search_log (discord_id, discord_username, discord_displayname, search_kind, search_input)
            VALUES (?, ?, ?, ?, ?)
            `,
            [data.discord_id, data.discord_username, data.discord_displayName, data.search_kind, data.search_input]
        );
    } catch (error) {
        console.error(error);
    } finally {
        if (conn) {
            conn.release();

            return rows;
        }
    }
}

async function getMobIdByMobName(name) {
    let conn, rows;

    try {
        conn = await pool.getConnection();
        rows = await conn.query(
            `
            SELECT DISTINCT
                mob_data.mobid AS id,
                mob_data.name
            FROM mob_data 
            INNER JOIN drop_data
            ON mob_data.mobid = drop_data.dropperid
            WHERE REPLACE(mob_data.name, ' ', '') LIKE ?
            `,
            [`%${name.replaceAll(' ', '')}%`]
        );
    } catch (error) {
        console.error(error);
    } finally {
        if (conn) {
            conn.release();

            return rows;
        }
    }
}

async function getMobDropData(mobId) {
    let conn, rows;

    try {
        conn = await pool.getConnection();
        rows = await conn.query(
            `
            SELECT DISTINCT 
                wz_itemdata.itemid,
                wz_itemdata.name,
                drop_data.chance
            FROM drop_data
            INNER JOIN wz_itemdata
                ON drop_data.itemid = wz_itemdata.itemid
            WHERE drop_data.dropperid = ?
        `,
            [parseInt(mobId, 10)]
        );
    } catch (error) {
        console.error(error);
    } finally {
        if (conn) {
            conn.release();

            return rows;
        }
    }
}

async function getItemIdByItemName(name) {
    let conn, rows;

    try {
        conn = await pool.getConnection();
        rows = await conn.query(
            `
            SELECT DISTINCT
                wz_itemdata.itemid AS id, 
                wz_itemdata.name 
            FROM wz_itemdata 
            INNER JOIN drop_data
            ON wz_itemdata.itemid = drop_data.itemid
            WHERE REPLACE(name, ' ', '') LIKE ?
            `,
            [`%${name.replaceAll(' ', '')}%`]
        );
    } catch (error) {
        console.error(error);
    } finally {
        if (conn) {
            conn.release();

            return rows;
        }
    }
}

async function getItemDropData(itemId) {
    let conn, rows;

    try {
        conn = await pool.getConnection();
        rows = await conn.query(
            `
            SELECT DISTINCT
                mob_data.name,
                drop_data.chance
            FROM mob_data
            INNER JOIN drop_data
                ON mob_data.mobid = drop_data.dropperid
            WHERE drop_data.itemid = ?
        `,
            [parseInt(itemId, 10)]
        );
    } catch (error) {
        console.error(error);
    } finally {
        if (conn) {
            conn.release();

            return rows;
        }
    }
}

export { insertLog, getMobIdByMobName, getMobDropData, getItemIdByItemName, getItemDropData };
