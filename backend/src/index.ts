import express from 'express';

const app = express();

app.use(express.json());

app.use("/create-profile", (req, res) => {

});

app.use((req, res) => {
    res.status(404);
    res.send('Deu 404 aqui');
})

export default app;