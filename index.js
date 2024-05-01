
import connectToDataBase from "./src/db/index.js";
import dotenv from 'dotenv';
import app from "./src/app.js";

dotenv.config();

// ================================
connectToDataBase()
  .then((response) => {
    if (response.success) {
      // If database connection successful, start the app
      app.listen(3000, () => {
        console.log("Express server running at 3000");
      });

      // Handle app errors
      app.on("error", (err) => {
        console.error("App error:", err);
      });
    } else {
      // If database connection fails, log error and stop the app
      console.error("Database connection error:", response.message);
      process.exit(1); // Exit process with failure
    }

  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
    process.exit(1); // Exit process with failure
  });