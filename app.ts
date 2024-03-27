import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";

import router from "./router";

const app = express();
app.use(cors());
app.use(compression());
app.use(helmet());

app.use(router);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

