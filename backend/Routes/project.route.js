import express from "express"
import { createProject } from "../Controller/project.controller.js"
import { openConnection } from "../utils/logs.js"

const router = express.Router()
router.post("/deploy", createProject)
router.get("/logs/stream", openConnection)

export default router