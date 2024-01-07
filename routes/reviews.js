const express = require("express");
const router = express.Router({mergeParams : true});
const Review = require("../models/review");
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError= require("../utils/ExpressError.js")
let {postReview , deleteReview} = require("../controllers/reviews.js")

const { validateReview , isLoggedIn , isAuthor} = require("../middleware.js");



router.post("/" , isLoggedIn , validateReview, wrapAsync(postReview))

router.delete("/:reviewId" , isLoggedIn , isAuthor , wrapAsync(deleteReview) )

module.exports =router;