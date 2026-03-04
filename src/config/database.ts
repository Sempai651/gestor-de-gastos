import { Sequelize } from 'sequelize';
import path from 'path';

const dbPath = path.join(__dirname, '../../gastos.sqlite');

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
  sync: { force: false }
});

export async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log(' Conectado a SQLite correctamente');
    
    await sequelize.sync();
    console.log(' Modelos sincronizados con la BD');
  } catch (error) {
    console.error(' Error al conectar a BD:', error);
    process.exit(1);
  }
}