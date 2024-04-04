const Listing = require('../MODELS/listing'); // Import the Listing model
const express=require("express");
const router=express.Router();


router.get('/', async (req, res) => {
    try {
        console.log("3");
        const listings = await Listing.find({}).lean();
        console.log(listings) // Fetch all listings
        res.json(listings);
    } catch (error) {
        console.log("4");
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports=router;


