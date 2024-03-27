import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import {config} from "dotenv";

import router from "./router";
import {notFoundHandler} from "./src/middleware/not-found";
import {errorHandler} from "./src/middleware/error";

const app = express();
app.use(cors());
app.use(compression());
app.use(helmet());

app.use("/files", router);
app.all("*", notFoundHandler);
app.use(errorHandler);

config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

