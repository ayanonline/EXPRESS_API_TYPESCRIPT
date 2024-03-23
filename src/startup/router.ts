import { Express, Request, Response } from "express";
import router from "../controllers/user.controller";
import { exceptionHandler } from "../shared/middlewares/exception-handling.middleware";

const routerSetup = (app: Express) =>
  app

    .get("/", async (req: Request, res: Response) => {
      res.send("Hello Express APIvantage!");
    })
    .use("/api/v1/users", router)

    // ----> error-handling middleware <----
    .use(exceptionHandler);

export default routerSetup;
