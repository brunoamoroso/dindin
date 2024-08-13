import express, { urlencoded } from 'express';
import cors from 'cors';
import profileRoutes from './routes/profile-routes';
import categoriesRoutes from './routes/categories-routes';
import accountsRoutes from './routes/account-routes';
import transactionRoutes from './routes/transaction-routes';


const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors({credentials: true, origin: "http://localhost:5173"}));

app.use("/profile", profileRoutes)
app.use("/categories", categoriesRoutes)
app.use("/accounts", accountsRoutes);
app.use("/transactions", transactionRoutes);


app.use((req, res) => {
    res.status(404);
    res.send('Deu 404 aqui');
});

app.listen(5001, () => {
    console.log('Server running on: http://localhost:5001')
}) 

export default app;