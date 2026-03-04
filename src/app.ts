import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
import gastosRoutes from './routes/gastos.routes';
import { errorHandler } from './middleware/errorHandler';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());


app.use('/api/v1/gastos', gastosRoutes);


app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend está funcionando' });
});


app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    data: null,
    error: { code: 'NOT_FOUND', message: 'Ruta no encontrada' }
  });
});


app.use(errorHandler);


async function startServer() {
  try {
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(` Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(' No se pudo iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();

export default app;