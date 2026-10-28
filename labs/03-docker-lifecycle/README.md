# Lab 03 — Containers have lifecycles

**Goal:** Distinguish images from running instances; use logs, ports, and persistent storage. **Requirements:** Working Docker Desktop/Engine. All examples run locally.

```bash
docker version
docker pull nginx:1.27-alpine
docker image ls
docker run --name it-web -d -p 127.0.0.1:8082:80 nginx:1.27-alpine
docker ps
docker logs it-web
```

Visit <http://127.0.0.1:8082>. `-p HOST:CONTAINER` publishes a specific host port. Observe that Docker doesn't automatically open a public cloud firewall.

Inspect the running instance:

```bash
docker inspect it-web
docker exec it-web nginx -v
docker stop it-web
docker ps -a
```

A **volume** survives container replacement until explicitly removed:

```bash
docker volume create it-data
docker volume ls
# Inspect it; do not remove unrelated volumes.
docker volume inspect it-data
```

Cleanup **only this lab's resources**:

```bash
docker rm it-web
docker volume rm it-data
```

Do not run `docker system prune -a --volumes` on a workstation that contains important data. It may remove resources unrelated to this lab.

**Challenge questions:** Is an image a process? Does `docker stop` remove a container? Does deleting a container also delete a named volume? Why bind to 127.0.0.1 in a training environment?

Docs: <https://docs.docker.com/learn/paths/get-started-with-docker-containers/>
