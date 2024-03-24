import { Express, Request, Response } from "express";
import router from "../controllers/user.controller";
import { exceptionHandler } from "../shared/middlewares/exception-handling.middleware";
import { pageNotFoundExceptionHandler } from "../shared/middlewares/page-not-found-exception-handler.middleware";

const routerSetup = (app: Express) =>
  app
    .get("/", async (req: Request, res: Response) => {
      res.send("Hello Express APIvantage!");
    })
    .use("/api/v1/users", router)

    .use("*", pageNotFoundExceptionHandler) // <---- 404 page handler

    // ----> error-handling middleware <----
    .use(exceptionHandler); // The exception handling middleware is the last one in the pipeline

export default routerSetup;
