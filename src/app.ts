import express from "express";
const app = express();
import appSetup from "./startup/init";
import routerSetup from "./startup/router";
import securitySetup from "./startup/security";
import dotenv from "dotenv";
import { NodeProcessEvents } from "./shared/enums/events/node-process-events.enum";
dotenv.config();

process.on(NodeProcessEvents.UncaughtException, (error: unknown) => {
  process.exit(1);
});

process.on(NodeProcessEvents.UnhandledRejection, (error: unknown) => {
  process.exit(1);
});

appSetup(app);
securitySetup(app, express);
routerSetup(app);
