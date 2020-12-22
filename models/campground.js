const mongoose = require("mongoose");
const Review = require("./review")
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String,   
})

ImageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload","/upload/w_200,h_150,c_pad")
});

const CampgroundSchema = new Schema({
    title: String,
    image: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    geometry: { 
        type:{
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
},{toJSON:{virtuals:true}});

CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
    return `<a href="/campgrounds/${this._id}">${this.title}</a>`
});

CampgroundSchema.post("findOneAndDelete",async function (doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model("Campground",CampgroundSchema);

