import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { Cashe } from './Cashe.js'

dotenv.config();
const log = console.log;

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cashe = new Cashe();


app.all('/*', async (req, res) => {
    let status, message;
    //https://wq9wrdu5e5.execute-api.eu-west-1.amazonaws.com/dev/products
    //id:7e02a3ac-a564-4291-ab8b-9a36fb736246
    // const { title, description, price, count } = event.body;
    let urlPath = req.url.split('/')[1]
    log(urlPath)
    const url = process.env[urlPath]
    if (url) {

        try {
            log(url);
            if (urlPath === 'products' && req.method === 'GET') {
                const dataCashe = cashe.getData;
                if (dataCashe) return res.json(dataCashe);

            }
            let respResult = await axios({
                method: req.method,
                url: url + req.url,
                ...(Object.keys(req.body || {}).length > 0 && { data: req.body }),
            })
            cashe.Data = respResult.data;
            status = respResult.status
            message = respResult.data

        } catch (e) {
            log(e);
            status = e.response.status;
            message = e.message;

        }

        res.status(status).json(message)

    } else {

        res.status(502).send('Cannot process request')

    }

})

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})