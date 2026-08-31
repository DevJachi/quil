export const registerRoute = async ({ host, containerName, port }) => {
    const response = await fetch(
        "http://localhost:2019/config/apps/http/servers/srv0/routes",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                match: [
                    {
                        host: [host]
                    }
                ],
                handle: [
                    {
                        handler: "reverse_proxy",
                        upstreams: [
                            {
                                dial: `${containerName}:${port}`
                            }
                        ]
                    }
                ]
            })
        }
    )

    if (!response.ok) {
        const errorText = await response.text()

        throw new Error(
            `Failed to register Caddy route: ${errorText}`
        )
    }
}