const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uo7e35u.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const classCollection = client.db('LinguoLab').collection('classes');
        const instructorCollection = client.db('LinguoLab').collection('instructor');
        const allClassesCollection = client.db('LinguoLab').collection('allClasses');
        const myClassesCollection = client.db('LinguoLab').collection('myClasses');

        app.get('/classes', async (req, res) => {
            const result = await classCollection.find().toArray();
            res.send(result);
        })

        app.get('/instructor', async (req, res) => {
            const result = await instructorCollection.find().toArray();
            res.send(result);
        })

        app.get('/all-classes', async (req, res) => {
            const result = await allClassesCollection.find().toArray();
            res.send(result);
        })

        app.get('/my-classes', async (req, res) => { 
            const email = req.query.email;
            if (!email) {
                res.send([]);
            }
            const query = { email: email };
            const result = await myClassesCollection.find(query).toArray();
            res.send(result);
        })

        app.post('/my-classes', async (req, res) => {
            const item = req.body;
            console.log(item);
            const result = await myClassesCollection.insertOne(item);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('LinguoLab boss server is running......');
})

app.listen(port, () => {
    console.log(`LinguoLab server listening on port ${port}`);
}) 