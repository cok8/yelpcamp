const mongoose = require("mongoose");
const Campground =  require("../models/campground");
const Review =  require("../models/review");

const cities = require("./cities");
const {places, descriptors} = (require("./seedHelpers"))

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open",()=>{
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random()*array.length)];

const seedDB = async ()=>{
    await Campground.deleteMany({});
    await Review.deleteMany({});
    for (let i = 0; i < 200; i++){
        const random1000 =  Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author: "5fdbb9ff1b181422d4c39c89",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: "Point",
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            image: [
                {
                    url: "https://res.cloudinary.com/daoy87kvt/image/upload/v1608502470/YelpCamp/chcl7irnstidkiseimuu.jpg",
                    filename : 'YelpCamp/chcl7irnstidkiseimuu'
                },
            ],
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores est libero vero voluptas pariatur cum temporibus magni at soluta sit. Illum natus ab quae nulla facere ipsum amet veritatis Lorem ipsum, dolor sit amet consectetur adipisicing elit. Modi alias ullam ratione non est dolor minus tenetur exercitationem nam? Reprehenderit earum voluptas blanditiis, ducimus labore adipisci libero commodi quos cumque! Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsa ut temporibus laborum ratione consequatur tempore necessitatibus vitae eius? Quibusdam aliquam est voluptates odio quaerat! Vero aperiam sint ad aut iste!",
            price : price,

        });
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
});