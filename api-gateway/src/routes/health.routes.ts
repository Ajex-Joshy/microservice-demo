import { Router, Request, Response } from "express";
import { HTTP_STATUS } from "@utils/http-status";

const router: Router = Router();

router.get("/health", (req: Request, res: Response) => {
  res.status(HTTP_STATUS.OK).json({ status: "ok" });
});

export default router;
