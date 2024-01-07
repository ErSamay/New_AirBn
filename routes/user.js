const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
let{saveRedirectUrl} = require("../middleware.js")
const passport = require("passport");
const{getUser , postUser , getLogin , postLogin , logOut} = require("../controllers/users.js")

router.route("/signup")
.get(getUser)
.post(wrapAsync(postUser))


router.route("/login")
.get( getLogin)
.post( passport.authenticate("local" , {
    failureRedirect : "/login" , 
    failureFlash : true,
}) , postLogin);


router.get("/logout" , logOut);


module.exports = router;