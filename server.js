import express from 'express';
import dotenv from 'dotenv';
import testRoutes from './routes/test.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.use('/api/test', testRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});