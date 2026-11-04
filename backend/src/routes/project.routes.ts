
import { Router } from "express";

import {
  createProject,
  getMyProjects,
  getProjectById,
  updateProject
} from "../controllers/project.controller";

import {
  createMilestone,
  getProjectMilestones,
  updateMilestone
} from "../controllers/milestone.controller";

import { authenticateToken } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

const router = Router();

router.use(authenticateToken);

// Project routes
router.post("/", authorizeRoles("CLIENT"), createProject);
router.get("/", getMyProjects);

// Milestone routes — keep these before the project ID route
router.post(
  "/:projectId/milestones",
  authorizeRoles("CLIENT"),
  createMilestone
);

router.get(
  "/:projectId/milestones",
  getProjectMilestones
);

router.patch(
  "/milestones/:milestoneId",
  authorizeRoles("CLIENT"),
  updateMilestone
);

// Individual project routes
router.get("/:id", getProjectById);
router.patch("/:id", authorizeRoles("CLIENT"), updateProject);

export default router;
