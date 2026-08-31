import fs from "fs";

export const initialSetup = () => {
    try {
        if (!fs.existsSync("./clones")) {
            fs.mkdirSync("./clones", { recursive: true });
            console.log("Clones folder created");
        } else {
            console.log("Clones folder already exists");
        }

    } catch (error) {
        console.error("Initial setup failed:", error.message);
        throw error;
    }
};