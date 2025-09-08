import app from "./src/app";
import "dotenv/config";
import "./src/database/dbConfig";

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Started server on port ${port}`);
});
