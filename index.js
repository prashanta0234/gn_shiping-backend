const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.erhb9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("shippingDelivery");
    const serviceCollaction = database.collection("services");
    const shipingCollaction = database.collection("shiping");
    const shipingTypeCollaction = database.collection("shipingType");

    app.get("/services", async (req, res) => {
      const cursor = serviceCollaction.find({});
      const serviecs = await cursor.toArray();
      res.send(serviecs);
    });
    app.get("/shipingType", async (req, res) => {
      const cursor = shipingTypeCollaction.find({});
      const serviecs = await cursor.toArray();
      res.send(serviecs);
    });

    // post shiping data
    app.post("/shiping", async (req, res) => {
      const newShiping = req.body;
      const result = await shipingCollaction.insertOne(newShiping);
      res.send(result);
    });
    // get shiping data
    app.get("/shiping", async (req, res) => {
      const cursor = shipingCollaction.find({});
      const shiping = await cursor.toArray();
      res.send(shiping);
    });

    // delate shiping data
    app.delete("/shiping/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(`${id}`) };
      const result = await shipingCollaction.deleteOne(query);
      res.send(result);
    });
    // add service
    app.post("/services", async (req, res) => {
      const newService = req.body;
      const result = await serviceCollaction.insertOne(newService);
      res.send(result);
    });
    // delate service data
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(`${id}`) };
      const result = await serviceCollaction.deleteOne(query);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
