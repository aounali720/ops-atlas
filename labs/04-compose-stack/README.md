# Lab 04 — Build a two-service Compose stack

**Goal:** Understand service-name DNS, reverse proxying, persistent volumes, health checks, and safe teardown. **Requirements:** Docker + Compose.

This example uses a tiny dependency-free Node.js counter API plus an Nginx gateway. **No cloud account is required.** Only the gateway is published, on `127.0.0.1:8081`.

```bash
cd labs/04-compose-stack
docker compose config
docker compose up --build -d
docker compose ps
docker compose logs --tail=25
```

Open <http://127.0.0.1:8081> or use `curl http://127.0.0.1:8081`. Refresh a few times and observe the counter. **Service-name DNS:** the gateway proxies to `http://app:3000` on the Compose network; there is no hardcoded container IP. The app saves counts to `/data/visits.json` in a named volume.

Restart only the app container to prove that data remains:

```bash
docker compose restart app
docker compose logs --tail=25 app
```

**Challenge A:** Explain what `depends_on: condition: service_healthy` changes compared to a simple dependency order. **Challenge B:** Remove the `volumes:` mount (only in a disposable lab) and predict what happens when the container is recreated. **Challenge C:** Compare the build stages and image sizes before and after adding a `.dockerignore`.

Cleanup (this leaves the volume intact):

```bash
docker compose down
```

When you deliberately want to **erase the lab data** too, use `docker compose down -v`. It removes this stack's declared named volume. Do not confuse it with `down` alone.

Docs: <https://docs.docker.com/compose/gettingstarted/>
