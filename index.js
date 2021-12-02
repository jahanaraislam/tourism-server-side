const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q1tq9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);


const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello World!");
});
client.connect((err) => {
    const toursCollection = client
        .db("birdily")
        .collection("tours");
    const bookingCollection = client.db("birdily").collection("booking");
    console.log(`database connected`);
    // get all tours

    app.get("/allTours", async (req, res) => {
        const result = await toursCollection.find({}).toArray();
        res.send(result);
    });

    // get single tour

    app.get("/singleTour/:id", (req, res) => {
        console.log(req.params.id);
        toursCollection
            .find({ _id: ObjectId(req.params.id) })
            .toArray((err, results) => {
                res.send(results[0]);
            });
    });
    // add booking

    app.post("/addBooking", async (req, res) => {
        const result = await bookingCollection.insertOne(req.body);
        res.send(result);
    });

    //get  my order by using email query

    app.get("/myBookings/:email", async (req, res) => {

        const result = await bookingCollection
            .find({
                userEmail: req.params.email,
            })
            .toArray();
        res.send(result);
    });

    // delete booking from my booking

    app.delete("/deleteBooking/:id", async (req, res) => {
        const result = await bookingCollection.deleteOne({
            _id: ObjectId(req.params.id),
        });
        res.send(result);
    });
    //  get all bookings
    app.get("/allBookings", async (req, res) => {
        const result = await bookingCollection.find({}).toArray();
        res.send(result);
    });
// change
    // delete booking from manage booking
    app.delete("/Managebooking/:id", async (req, res) => {
        const result = await bookingCollection.deleteOne({
            _id: ObjectId(req.params.id),
        });
        res.send(result);
    });
    // add tour

    app.post("/addTour", async (req, res) => {

        const result = toursCollection.insertOne(req.body);
        res.send(result);
    });
    // update manage booking by approved status
    
    app.put("/update/:id", async (req, res) => {
        const id = req.params.id;
        const updatedStatus = req.body;

        const filter = { _id: ObjectId(id) }

        bookingCollection
            .updateOne(filter, {
                $set: {
                    status: updatedStatus.status,
                },
            })
            .then((result) => {
                res.send(result);
            });
    });
    // perform actions on the collection object
    //   client.close();
});

app.listen(port, () => {
    console.log(`Listening to port : ${port}`);
});
// app.listen(process.env.PORT || port);
