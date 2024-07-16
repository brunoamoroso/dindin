import express, { urlencoded } from 'express';
import cors from 'cors';
import profileRoutes from './routes/profile-routes';


const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors({credentials: true, origin: "http://localhost:5173"}));

app.use("/profile", profileRoutes)

app.get("/", (req, res) => {
    res.send('hello world')
});

app.use((req, res) => {
    res.status(404);
    res.send('Deu 404 aqui');
});

app.listen(5001, () => {
    console.log('Server running on: http://localhost:5001')
}) 

export default app;