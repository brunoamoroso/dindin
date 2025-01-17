import express from 'express';
import cors from 'cors';
import profileRoutes from './routes/profile-routes';
import categoriesRoutes from './routes/categories-routes';
import accountsRoutes from './routes/account-routes';
import transactionRoutes from './routes/transaction-routes';
import path from 'path';


const app = express();

app.use(cors({credentials: true, origin: "http://localhost:5173"}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/profile", profileRoutes)
app.use("/categories", categoriesRoutes)
app.use("/accounts", accountsRoutes);
app.use("/transactions", transactionRoutes);

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use((req, res) => {
    res.status(404);
    res.send('Deu 404 aqui');
});

app.listen(5001, () => {
    console.log('Server running on: http://localhost:5001')
}) 

export default app;