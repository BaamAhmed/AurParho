//GENERAL IMPORTS========================================
let express 		= require("express"),
	app				= express(),
	bodyParser 		= require("body-parser"),
	mongoose 		= require("mongoose"),
	flash			= require("connect-flash"),
	Note 			= require("./models/note"),
	Comment 		= require("./models/comment"),
	seedDB 			= require("./seeds"),
	passport		= require("passport"),
	LocalStrategy	= require("passport-local"),
	User 			= require("./models/user.js"),
	methodOverride	= require("method-override")
//=======================================================	
	
//ROUTES IMPORTS ========================================
	// commentRoutes	= require("./routes/comments"),
	noteRoutes		= require("./routes/notes"),
	authRoutes		= require("./routes/authentication");
//=======================================================




//SEEDING FUNCTION=======================================
//seedDB();
//=======================================================




//DATABASE CONFIG========================================
// mongoose.connect("mongodb://localhost:27017/yelp_camp",
mongoose.connect('mongodb://localhost:27017/new_thing',
// mongoose.connect('mongodb+srv://BaamAhmed:aurparho@aurparho.seqhs.mongodb.net/aurparho?retryWrites=true&w=majority',
	{
	useNewUrlParser: true,
	useUnifiedTopology: true
	}
)
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));
//=======================================================

//APP CONFIG ============================================
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//=======================================================






//AUTHENTICATION CONFIG ==================================

	//SESSION CONFIG=====================================
	app.use(require("express-session")({
		secret: "randomshit",
		resave: false,
		saveUninitialized: false
	}));
	//===================================================

	//SETTING UP PASSPORT ===============================
	app.use(passport.initialize());
	app.use(passport.session());

	passport.serializeUser(User.serializeUser());
	passport.deserializeUser(User.deserializeUser());

	passport.use(new LocalStrategy(User.authenticate()));
	//===================================================

	//SHARING CURRENT USER STATUS WITH ALL ROUTES =======
	app.use(function(req, res, next){
		res.locals.currentUser 	= req.user;
		res.locals.error		= req.flash("error");
		res.locals.success		= req.flash("success");
		next();
	})
	//===================================================

	//USING REFACTORED ROUTES ===========================
	app.use(authRoutes);
	app.use("/notes", noteRoutes);
	// app.use("/campgrounds/:id/comments", commentRoutes)
	app.use(function(req, res, next){
		res.status(404);
		res.render("notFound");
	  });
	//===================================================

//========================================================







//SERVER CONFIG ==========================================
let port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("Serving on port 3000");
})
//========================================================