if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
 
const express = require("express");
const app = express()
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path")
var methodOverride = require('method-override')
var ejsMate = require("ejs-mate")
const wrapAsync = require("./utils/wrapAsync.js");

const session = require('express-session');
const MongoStore = require('connect-mongo');

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

const dbUrl = "mongodb+srv://samayjain564:FbgzGweWf0UJosEV@cluster1.lvhkpcg.mongodb.net/?retryWrites=true&w=majority"


main().then(() => {
    console.log("Connected Successfully");
}).catch((err) => {
    console.error("Connection error:", err);
});

async function main() {
    try {
      await mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        writeConcern: {
          w: 'majority'
        }
      });
      console.log("MongoDB Connected");
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error.message);
     
    }
  }
  

  


app.set("view engine" , "ejs")
app.set("views" , path.join(__dirname , "views"))
app.use(express.urlencoded({extended : true}))
app.use(express.static (path.join(__dirname , "public")))
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate);


const store = MongoStore.create({
    mongoUrl : dbUrl, 
    crypto :{
      secret : process.env.SECRET, 
    },
    touchAfter : 24 * 3600
  })
  
store.on("error" , () => {
    console.log("Error in Mongo Store" , err);
});

const sessionOptions = {
    store : store , 
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires : Date.now() + 7 + 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    }
}

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req , res , next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user
    next();
});




app.use("/listings" ,listingRouter);
app.use("/listings/:id/reviews" ,reviewRouter);
app.use("/" , userRouter);

app.all("*" , (req , res , next) => {
    next(new ExpressError(404 , "Page not Found"))
})



app.use((err , req ,res ,next) => {
   let{statusCode=500 , message="Something Went wrong"} = err;
   res.render("error.ejs" , {err})

})


app.listen(3000);