# Quix

Quix is a self-hosted deployment platform. Paste a public GitHub URL, give your project a name, and Quix clones the repo, builds a Docker image using Railpack, runs the container, and routes it to `projectname.localhost` through Caddy — all from a browser UI.

## How it works

1. You enter a GitHub URL and project name in the UI
2. The backend clones the repo, builds a Docker image with Railpack, and runs the container
3. Build logs stream to the UI in real time over SSE
4. Caddy is configured dynamically to route `projectname.localhost` to the running container

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Ports `80`, `3000`, `3001`, and `2019` free on your machine
- On Linux only: Docker Desktop is not required but you need to ensure `host.docker.internal` resolves — the compose file handles this automatically via `host-gateway`

## Setup

**1. Clone the repo**

```bash
git clone https://github.com/yourname/quix.git
cd quix
```

**2. Create the backend environment file**

```bash
cp backend/.env.example backend/.env
```

The defaults work out of the box for local development. No accounts or external services needed.

**3. Start everything**

```bash
docker compose -f backend/compose.yaml up --build
```

This starts four services:

| Service | What it does | Port |
|---|---|---|
| `frontend` | Next.js UI | 3000 |
| `backend` | Express API | 3001 |
| `caddy` | Reverse proxy + admin API | 80, 2019 |
| `buildkit` | Docker image builder | — |

**4. Open the UI**

Go to `http://localhost:3000`

Enter a public GitHub repo URL and a project name, then click Deploy.

**5. View your deployed app**

Once the build finishes, your app is live at:

```
http://projectname.localhost
```

Replace `projectname` with whatever name you entered in the form.

> On Windows, `.localhost` subdomains resolve automatically. On Linux, if `projectname.localhost` does not resolve, add the following to `/etc/hosts`:
> ```
> 127.0.0.1   projectname.localhost
> ```

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | Port the backend API listens on |
| `BUILDKIT_HOST` | `docker-container://buildkit` | BuildKit daemon address used by Railpack |

## Project structure

```
quix/
├── backend/
│   ├── Controller/        # Route handlers
│   ├── Routes/            # Express route definitions
│   ├── utils/
│   │   ├── caddy.js       # Registers routes with Caddy Admin API
│   │   ├── checkPorts.js  # Finds a free host port for each deployment
│   │   ├── logs.js        # SSE broadcast and log history
│   │   └── setup.js       # Creates clones directory on startup
│   ├── caddy/
│   │   └── config.json    # Initial Caddy config loaded at startup
│   ├── clones/            # Cloned repos (created at runtime)
│   ├── compose.yaml
│   ├── Dockerfile
│   └── server.js
└── frontend/
    ├── app/
    │   ├── components/    # Header, Hero, DeployForm, DeploymentCard
    │   ├── layout.tsx
    │   └── page.tsx
    └── Dockerfile
```

## Stopping

```bash
docker compose -f backend/compose.yaml down
```

To also remove volumes (clears Caddy's stored config):

```bash
docker compose -f backend/compose.yaml down -v
```
