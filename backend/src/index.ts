import express from 'express';

const app = express();

app.use(express.json());


app.get("/", (req, res) => {
    res.send('hellow world')
})

app.get("/create-profile", (req, res) => {
    console.log('oi'); 
});

app.use((req, res) => {
    res.status(404);
    res.send('Deu 404 aqui');
});

app.listen(5001, () => {
    console.log('Server running on: http://localhost:5001')
}) 

export default app;