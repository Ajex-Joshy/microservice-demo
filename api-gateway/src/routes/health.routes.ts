import { Router, Request, Response } from "express";
import { HTTP_STATUS } from "@shared/constants/http-status.constants.js";

const router: Router = Router();

router.get("/health", (req: Request, res: Response) => {
  res.status(HTTP_STATUS.OK).json({ status: "ok" });
});

export default router;
