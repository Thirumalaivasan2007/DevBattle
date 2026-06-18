# Incident Response Runbooks

These runbooks detail the steps to diagnose and mitigate common operational issues in the DevBattle production environment.

## 1. High API Latency

**Symptoms:**
- P99 API latency > 500ms
- Uptime checks failing intermittently
- Increase in 502/504 Bad Gateway errors on Ingress

**Diagnosis Steps:**
1. **Check Dashboard**: Navigate to `/admin/operations`. Observe the `Active Workers` and `API Traffic` metrics.
2. **Check Database**: Is MongoDB CPU > 80%? If yes, look for slow queries or missing indexes.
3. **Check Cache**: Is Redis down? The backend graceful degrades if Redis is offline, meaning all queries hit the DB directly, causing latency.

**Mitigation:**
1. Manually scale up the backend pods: `kubectl scale deployment core-backend --replicas=10`
2. If Redis is down, restart the deployment: `kubectl rollout restart deployment redis-cache`

## 2. Code Execution Bottleneck

**Symptoms:**
- Users complain that their code "Pending..." status takes more than 5 seconds.
- `Queued Submissions` in the Operations Dashboard is growing rapidly.

**Diagnosis Steps:**
1. View Execution Engine logs: `kubectl logs -l app=execution-engine -f`. Look for `DockerTimeout` or `MemoryLimitExceeded` loops.
2. Check if a specific user/IP is spamming large infinite loop codes.

**Mitigation:**
1. Identify abusive users and ban/rate-limit them from the Admin Panel.
2. Scale up the Execution Engine workers: `kubectl scale deployment execution-engine --replicas=20`

## 3. High Memory Usage / OOMKilled Pods

**Symptoms:**
- Pods are frequently restarting.
- Kubernetes events show `OOMKilled`.

**Diagnosis Steps:**
1. Identify which pod is dying: `kubectl get pods -w`
2. Check memory metrics in Grafana. Node.js backend might have a memory leak (e.g. accumulating unclosed socket connections).

**Mitigation:**
1. Immediately restart the affected deployment to clear memory: `kubectl rollout restart deployment <name>`
2. Capture a heap dump if possible before restart.
3. Temporarily increase memory limits in the deployment YAML and apply.
