import { Router } from "express";
import { getFreelancers } from "../controllers/user.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/freelancers", authenticateToken, getFreelancers);

export default router;