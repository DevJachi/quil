import "dotenv/config"
import { exec } from "child_process"
import { spawn } from "child_process";
import fs from "fs"
import { registerRoute } from "../utils/caddy.js"
import { findAvailablePort } from "../utils/checkPorts.js"
import { broadcast } from "../utils/logs.js"

//On Docker Desktop appp
//Set Buildkit host:  export BUILDKIT_HOST='docker-container://buildkit'
export const createProject = async (req, res) => {
    const { projectName, githubUrl } = req.body
    const cloneDir = `./clones/${projectName}`

    try {
        console.log('BUILDKIT_HOST seen by Node:', process.env.BUILDKIT_HOST)

        if (!projectName || !githubUrl) {
            res.status(400).json({msg: "All fields required"})
            return
        }

        if (fs.existsSync(cloneDir)) {
            broadcast("Clearing Cache")

            //Deletes Project Folder
            fs.rmSync(cloneDir, { recursive: true, force: true })

            //Delete Container
            exec(`docker rm -f ${projectName}`, {
                stdio: "inherit"
            })

            //Delete Image
            exec(`docker rmi -f ${projectName}`, {
                stdio: "inherit"
            });
        }

        fs.mkdirSync(cloneDir, { recursive: true })

        //1
        broadcast("Cloning Repo")

        await new Promise((resolve, reject) => {
            const child = spawn("git", ["clone", githubUrl, cloneDir]);

            child.stdout.on("data", (data) => {
                broadcast(data.toString());
            });

            child.stderr.on("data", (data) => {
                broadcast(data.toString());
            });

            child.on("error", (error) => {
                reject(error)
            });

            child.on("close", (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(
                        new Error(`Railpack build exited with code ${code}`)
                    );
                }
            });
        })

        console.log("Repo Cloned")
        console.log("Building Image...")

        //2
        await new Promise((resolve, reject) => {
            const child = spawn(
                "railpack",
                ["build", cloneDir, "--name", projectName],
                {
                    env: {
                        ...process.env,
                        BUILDKIT_HOST: "docker-container://buildkit"
                    }
                }
            );

            child.stdout.on("data", (data) => {
                broadcast(data.toString());
            });

            child.stderr.on("data", (data) => {
                broadcast(data.toString());
            });

            child.on("error", (error) => {
                reject(error);
            });

            child.on("close", (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(
                        new Error(`Railpack build exited with code ${code}`)
                    );
                }
            });
        });

        console.log("Image Built Successfully");

        const avaliablePort = await findAvailablePort()

        //3
await new Promise((resolve, reject) => {
    const child = spawn(
        "docker",
        [
            "run",
            "-d",
            "--network",
            "quix-net",
            "--name",
            projectName,
            "-p",
            `${avaliablePort}:80`,
            projectName
        ]
    );

    child.stdout.on("data", (data) => {
        broadcast(data.toString());
    });

    child.stderr.on("data", (data) => {
        broadcast(data.toString());
    });

    child.on("error", (error) => {
        broadcast(`Docker error: ${error.message}`);
        reject(error);
    });

    child.on("close", (code) => {
        if (code === 0) {
            resolve();
        } else {
            const error = new Error(
                `Docker run exited with code ${code}`
            );

            broadcast(error.message);
            reject(error);
        }
    });
});

        broadcast(`${projectName} container running`);
        console.log(`${projectName} container running`);
        
        await registerRoute({
            host: `${projectName}.localhost`,
            port: avaliablePort
        })       
            
        console.log(`Project live @: ${projectName}.localhost`)
        broadcast(`Project is live@ http://${projectName}.localhost `)

        console.log(`Port ${avaliablePort} `)

        res.status(200).json({
            msg: "Project deployed successfully",
            port: avaliablePort,
            name: projectName
        })
    } catch (error) {
        res.status(500).json({
            msg: "Deployment failed",
            error: error.message
        })
    }
}