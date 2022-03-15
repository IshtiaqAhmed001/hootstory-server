const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oteh7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// console.log(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db("hoot_story");
        const storiesCollection = database.collection('stories');

        app.get('/stories', async (req, res) => {
            const cursor = storiesCollection.find({});
            const stories = await cursor.toArray();
            res.json(stories);
        });
        app.post('/stories', async (req, res) => {
            const newBlog = req.body;
            const result = await storiesCollection.insertOne(newBlog);
            // console.log(newBlog);
            res.json(result)
        });
        app.delete('/stories', async (req, res) => {
            const result = await storiesCollection.deleteMany({});
            res.json(result);
        });
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello HootStory!')
})

app.listen(port, () => {
    console.log(`listening at port ${port}`)
})