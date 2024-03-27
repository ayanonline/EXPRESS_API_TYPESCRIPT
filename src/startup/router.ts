import { Express, Request, Response } from "express";
import userRouter from "../controllers/user.controller";
import { errorHandler } from "../middlewares/error-handling/error-handling.middleware";
import { pageNotFoundErrorHandler } from "../middlewares/error-handling/page-not-found-handler.middleware";

const routerSetup = (app: Express) => {
  //Home Route
  app.get("/", async (req: Request, res: Response) => {
    res.send("Hello Express APIvantage!");
  });

  // User Route
  app.use("/api/v1/users", userRouter);

  // ----> 404 page handler <----
  app.use("*", pageNotFoundErrorHandler);

  // ----> error-handling middleware <----
  app.use(errorHandler);

  return app;
};

export default routerSetup;
