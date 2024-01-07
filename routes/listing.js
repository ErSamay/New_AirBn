const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError= require("../utils/ExpressError.js")
const{listingSchema , reviewSchema} = require("../schema.js")
const {isLoggedIn , isOwner , validateListing} = require("../middleware.js");
const{index , newForm , showListing , postListing , edit , editListing , deleteListing} = require("../controllers/listing.js");
const multer  = require('multer');
const{storage} = require("../cloudConfig.js");
const upload = multer({ storage });


router.get("/new" , isLoggedIn, newForm );

router.route("/")
.get(wrapAsync(index))
.post( 
    isLoggedIn ,
     upload.single('listing[image]'),
     validateListing, 
     wrapAsync(postListing)
)

router.route("/:id")
.get( wrapAsync(showListing))
.put( isLoggedIn ,
    isOwner ,
    upload.single('listing[image]'), 
    validateListing ,
    wrapAsync(editListing))
.delete(
    isLoggedIn ,isOwner ,
    wrapAsync(deleteListing))




router.get("/:id/edit" , isLoggedIn , isOwner , wrapAsync(edit))







module.exports = router;