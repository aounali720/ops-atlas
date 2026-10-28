# Lab 05 — Kubernetes rollout and recovery

**Goal:** Understand namespace, ConfigMap, Deployment, resources, readiness and ClusterIP networking. **Requirement:** Local `kind` or `minikube` cluster, plus `kubectl`. Never point this at production.

**Preflight:** `kubectl config current-context` then `kubectl get nodes`. Confirm you are targeting your disposable cluster.

```bash
cd labs/05-kubernetes
kubectl apply --dry-run=client -f app.yaml
kubectl apply -f app.yaml
kubectl -n stackbound-lab get pods,deployments,services
kubectl -n stackbound-lab describe deployment sb-web
kubectl -n stackbound-lab rollout status deployment/sb-web
```

Wait for the image pull and Pod readiness. To verify locally:

```bash
kubectl -n stackbound-lab port-forward service/sb-web 8083:80
```

In another terminal, open <http://127.0.0.1:8083>. The ClusterIP is internal; this port-forward is temporary.

**Investigate:** `kubectl -n stackbound-lab get events --sort-by=.metadata.creationTimestamp`, `kubectl -n stackbound-lab logs deployment/sb-web`, `kubectl -n stackbound-lab get pods -o wide`.

**Experiment:** Change replica count from 2 to 3. Apply again and observe. Change image tag to a non-existent tag (only in your disposable cluster), observe image pull failure, restore the working tag and watch recovery.

**Cleanup:** `kubectl delete -f app.yaml`. This deletes only the objects declared in the lab manifest, including its test namespace. Confirm context again before deletion.

**Discussion:** Why use a Service rather than Pod IP? Why are requests and limits distinct? When could a health check cause a restart storm? How does changing one line in a manifest trigger a rollout?

Docs: <https://kubernetes.io/docs/tutorials/kubernetes-basics/>
