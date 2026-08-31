import net from "net";

  const isPortAvailable = (port) => {
    return new Promise((resolve) => {
        const server = net.createServer();

        server.once("error", () => {
            resolve(false);
        });

        server.once("listening", () => {
            server.close();
            resolve(true);
        });

        server.listen(port, "127.0.0.1");
    });
};

export const findAvailablePort = async (startPort = 3001) => {
    let port = startPort;

    while (!(await isPortAvailable(port))) {
        port++;
    }

    return port;
};