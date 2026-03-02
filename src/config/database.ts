import Database from "better-sqlite3";
import path from "node:path";



const dbPath = path.join(__dirname, '../../gastos.db');

export const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

/**
 * Hacemos la tabla gastos con seguridad de por medio 
 */

db.exec(`
    CREATE TABLE IF NOT EXISTS gastos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    descripcion TEXT NOT NULL,
    monto REAL NOT NULL,
    categoria TEXT NOT NULL CHECK(
    categoria IN ('Comida','Transporte','Entretenimiento','Utilidades','otros')
    ),
    
    fecha TEXT NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
    
    `);

    console.log('base de datos iniciada correctamente');