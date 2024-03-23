import express from "express";
const app = express();
import appSetup from "./startup/init";
import routerSetup from "./startup/router";
import securitySetup from "./startup/security";
import dotenv from "dotenv";
dotenv.config();

appSetup(app);
securitySetup(app, express);
routerSetup(app);
