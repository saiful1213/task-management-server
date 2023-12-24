const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// middleware
app.use(cors({
   origin: ['http://localhost:5173', 'https://task-management-ebe10.web.app'],
   credentials: true,
}))
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f8d3p09.mongodb.net/?retryWrites=true&w=majority`;

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
      // await client.connect();
      const todoCollection = client.db('task-management').collection('todo');

      // get all task 
      app.get('/todo', async (req, res) => {
         const result = await todoCollection.find().toArray();
         res.send(result);
      })

      // get single task 
      app.get('/todo/update/:id', async (req, res) => {
         const id = req.params.id;
         const query = {
            _id: new ObjectId(id)
         }
         const result = await todoCollection.findOne(query);
         res.send(result);
      })

      // post task
      app.post('/todo', async (req, res) => {
         const task = req.body;
         const result = await todoCollection.insertOne(task);
         res.send(result);
      })

      // update task
      app.patch('/todo/taskUpdate/:id', async (req, res) => {
         const id = req.params.id;
         const updatedTask = req.body;
         const filter = {
            _id: new ObjectId(id)
         }
         const updateDoc = {
            $set: {
               ...updatedTask
            },
         };
         const result = await todoCollection.updateOne(filter, updateDoc);
         res.send(result);
      })

      // delete task
      app.delete('/todo/:id', async (req, res) => {
         const id = req.params.id;
         const query = {
            _id: new ObjectId(id)
         }
         const result = await todoCollection.deleteOne(query);
         res.send(result);
      })


      // Send a ping to confirm a successful connection
      // await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
   } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
   }
}
run().catch(console.dir);




app.get('/', (req, res) => {
   res.send('Task Management Server is running!')
})

app.listen(port, () => {
   console.log(`Task Management Server is running on port ${port}`)
})