import express from 'express';
import cors from 'cors';
const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('Welcome to the backend!');
});

const PORT = 1234;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});