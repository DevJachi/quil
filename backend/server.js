          import 'dotenv/config'
          import { initialSetup } from './utils/setup.js';
          import express from "express";
          import cors from "cors";
          import projectRoutes from "./Routes/project.route.js"
          
          const app = express();
          app.use(cors());
          app.use(express.json());

          app.use("/api", projectRoutes)

          
          const PORT = process.env.PORT || 3001;
          
          app.get("/", (req, res) => {
            res.send("Backend Server is running ");
          });
          
          app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
            initialSetup()
          });
          