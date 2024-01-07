const User = require("../models/user.js");

module.exports.getUser = (req , res) => {
    res.render("users/signUp.ejs")
}


module.exports.getLogin = (req , res) => {
    res.render("users/login.ejs")
}

module.exports.postUser = async (req , res) => {
    try{
        let{username ,email ,  password } = req.body;
        const newUser = new User({email , username});
        const registeredUser = await User.register(newUser , password);
        req.login(registeredUser , () => {
            if(err){
                return next(err);
            }
            req.flash("success" , "Welcome To WanderLust")
            res.redirect("/listings");
        })
       
    }
    catch(e) {
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
}

module.exports.postLogin = async(req , res) => {
    req.flash("success" , "Welcome back To WanderLust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}
module.exports.logOut = (req ,res , next) => {
    req.logout((err) => {
        if(err){
           return next(err);
        }
        req.flash("success"  , "you are logged out");
        res.redirect("/listings");
    });
}
