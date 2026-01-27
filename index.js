const express=require('express');
const bodyParser=require('body-parser');
const env=require('dotenv')
const mongoose=require('mongoose');
const Movie = require('./models/movie.model');


env.config();
const app=express();

app.use(bodyParser.urlencoded({
  extended:true
}));

app.use(bodyParser.json())


app.get("/home",(req,res)=>{
  console.log("Hitting home");
 return res.json({
    success:true,
    message:"Fetched home"
  });
});



//In this remember it is the way in hich we can connect mogngodb with help of async await
// app.listen(process.env.PORT,async()=>{
//   console.log("Server is running on 3000");

//  await mongoose.connect(process.env.DB_URL)
//  console.log("Successfully connected to mongo");
// });


// app.listen(process.env.PORT, () => {
//   console.log(`Server is running on ${process.env.PORT}`);

//   mongoose.connect(process.env.DB_URL)
//     .then(() => {
//       console.log("Successfully connected to MongoDB");
//     })
//     .catch((err) => {
//       console.log("Error while connecting to MongoDB", err);
//     });
// });

app.listen(process.env.PORT, async () => {
  console.log(`Server is running on ${process.env.PORT}`);

  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Successfully connected to MongoDB");
    await Movie.create({
        name:"Bachhan Pandey",
        description:"Comdey masal movie",
        casts:["Akshay Kumar","Kriti Sanon","Jaxqueline Fernandiz"],
        director:"Farhad Samji",
        trailerUrl:"http://bachhanpandey/tarilers/1",
        language:"Hindi",
        relaseDate:"18-03-2022",
        releaseStatus:"RELEASED"
    });

  } catch (err) {
    console.log("Error while connecting to MongoDB", err);
  }
});


