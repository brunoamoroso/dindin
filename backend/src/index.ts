import express from 'express';
import cors from 'cors';
import profileRoutes from './routes/profile-routes';
import categoriesRoutes from './routes/categories-routes';
import accountsRoutes from './routes/account-routes';
import transactionRoutes from './routes/transaction-routes';
import path from 'path';
import coinRoutes from './routes/coin-routes';
import dotenv from 'dotenv';
import { getCoinCoversURL } from './utils/get-coin-covers';

dotenv.config({path: '.env.local'});

const app = express();

app.use(cors({credentials: true, origin: process.env.FRONTEND_URL}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/profile", profileRoutes)
app.use("/categories", categoriesRoutes)
app.use("/accounts", accountsRoutes);
app.use("/transactions", transactionRoutes);
app.use("/coins", coinRoutes);

app.use((req, res) => {
    res.status(404);
    res.send('Deu 404 aqui');
});

app.listen(process.env.PORT, () => {
    console.log('Server running on port: ' + process.env.PORT);
}) 

export default app;