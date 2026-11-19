import express from 'express';
import cors from 'cors'; // Importe o cors
import { routes } from './routes';

const app = express();

app.use(cors()); // Adicione esta linha antes do express.json()
app.use(express.json());
app.use(routes);

const PORT = 3333;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});