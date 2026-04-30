import { HTTP_STATUS } from "@utils/http-status";
import { type Request, type Response, Router } from "express";

const router: Router = Router();

router.get("/health", (_req: Request, res: Response) => {
  res.status(HTTP_STATUS.OK).json({ status: "ok" });
});

export default router;
