import app from "./app.js";
import { Constants } from "./contants.js";
import connectDB from "./db/index.js";

connectDB()
  .then(() => {
    app.listen(Constants.PORT, () => {
      console.log(`Server running on port ${Constants.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed: ", error);
    process.exit(1);
  });
