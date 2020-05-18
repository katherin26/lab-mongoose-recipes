const mongoose = require("mongoose");

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require("./models/Recipe.model");
// Import of the data from './data.json'
const data = require("./data");

const MONGODB_URI = "mongodb://localhost:27017/recipe-app";

// Connection to the database "recipe-app"
mongoose
  .connect(MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((self) => {
    console.log(`Connected to the database: "${self.connection.name}"`);
    // Before adding any documents to the database, let's delete all previous entries
    return self.connection.dropDatabase();
  })
  .then(() => {
    // Run your code here, after you have insured that the connection was made
    //let newRecipe = new Recipe(data[0]);
    Recipe.insertMany(data)
      .then((insertedRecords) => {
        for (let record of insertedRecords)
          console.log(`Created recipe ${record.title}`);

        return Recipe.findOneAndUpdate(
          { title: "Rigatoni alla Genovese" },
          { duration: 100 }
        );
      })
      .then((d) => {
        console.log("Updated Recipe");
        return Recipe.deleteOne({ title: "Carrot Cake" });
      })
      .then((d) => {
        console.log("Deleted Recipe");
        return mongoose.connection.close();
      })
      .then((d) => {
        console.log("Closed DB");
      })
      .catch((e) => {
        console.error(e);
      });
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
  });
