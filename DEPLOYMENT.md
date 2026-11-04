# 🏗️ DUKAAN Atelier — Enterprise Docker, Kubernetes & CI/CD Architecture

Production deployment guide and architectural specification for the **DUKAAN** luxury e-commerce platform.

---

## 📑 Table of Contents
1. [Architecture Overview](#-architecture-overview)
2. [Docker Deployment](#-docker-deployment)
3. [Kubernetes Architecture & Ordering](#-kubernetes-architecture--ordering)
4. [CI/CD Pipeline (GitHub Actions)](#-cicd-pipeline-github-actions)
5. [Disaster Recovery & Daily Backups](#-disaster-recovery--daily-backups)
6. [Security & Hardening](#-security--hardening)

---

## 🏛️ Architecture Overview

The DUKAAN platform uses a zero-trust, cloud-native containerized architecture:

```
                  ┌─────────────────────────────────────────┐
                  │          Cloudflare / Route 53          │
                  └────────────────────┬────────────────────┘
                                       │ HTTPS (443)
                  ┌────────────────────▼────────────────────┐
                  │    Kubernetes Ingress (NGINX + TLS)     │
                  └──────────┬───────────────────┬──────────┘
                             │                   │
                     /api/*  │                   │  /*
                             │                   │
           ┌─────────────────▼────────┐ ┌────────▼────────────────┐
           │  dukaan-backend-service  │ │ dukaan-frontend-service │
           │      (Port: 5000)        │ │       (Port: 80)        │
           └────────────┬─────────────┘ └────────┬────────────────┘
                        │                        │
       ┌────────────────┴───────────────┐        │
       │ Pod Replicas (HPA 3 to 10)     │        │ Pod Replicas (HPA 3 to 10)
       │ • backend-pod-1                │        │ • frontend-pod-1
       │ • backend-pod-2                │        │ • frontend-pod-2
       │ • backend-pod-3                │        │ • frontend-pod-3
       └────────────────┬───────────────┘        └────────────────────────┘
                        │
       ┌────────────────▼────────────────────────────────────────┐
       │   PostgreSQL 16 StatefulSet with Row Level Security    │
       │   • PersistentVolumeClaim (20Gi SSD)                    │
       │   • Automated Daily Backup CronJob (50Gi Archive PVC)   │
       └─────────────────────────────────────────────────────────┘
```

---

## 🐳 Docker Deployment

### Prerequisites
- Docker Engine 24.0+
- Docker Compose v2.20+

### 1. Local Full-Stack Launch
To spin up the entire production-grade stack (Frontend, NGINX Load Balancer, dual Node.js API replicas, PostgreSQL with RLS, and backup cron):

```bash
# Build and run all services in background
docker compose up -d --build

# Verify all containers are running & healthy
docker compose ps
```

### 2. Service Endpoints
| Component | Container Name | Port Mapping | Healthcheck |
| :--- | :--- | :--- | :--- |
| **Load Balancer / Gateway** | `dukaan-load-balancer` | `80:80`, `8080:80` | `/health` |
| **Frontend (React SPA + NGINX)** | `dukaan-frontend-app` | Internal (80) | `wget http://localhost:80/` |
| **Clustered API Instance 1** | `dukaan-api-instance-1` | Internal (5000) | `wget http://localhost:5000/health` |
| **Clustered API Instance 2** | `dukaan-api-instance-2` | Internal (5000) | `wget http://localhost:5000/health` |
| **PostgreSQL 16 (RLS)** | `dukaan-postgres-db` | `5432:5432` | `pg_isready -U postgres` |
| **Automated Backup Cron** | `dukaan-db-backup-cron` | Background Daemon | Cron scheduler at 02:00 AM |

---

## ☸️ Kubernetes Architecture & Ordering

All Kubernetes manifests are located in `k8s/` and configured to deploy in **strict dependency order** to prevent race conditions:

### Manifest Execution Sequence:
```
1. 00-namespace.yaml             -> Creates isolated `dukaan-production` namespace
2. 01-configmap.yaml             -> Configures environment variables, ports & URLs
3. 02-secrets.yaml               -> Injects database passwords, JWT tokens & credentials
4. 03-postgres-pvc.yaml          -> Provisions persistent SSD storage for DB & backups
5. 04-postgres-statefulset.yaml  -> Deploys PostgreSQL 16 with health probes & RLS schema
6. 05-backend-deployment.yaml    -> Deploys 3 Node.js API replicas with rolling updates
7. 06-backend-service.yaml       -> Creates ClusterIP service & PodDisruptionBudget
8. 07-frontend-deployment.yaml   -> Deploys 3 unprivileged NGINX frontend pods
9. 08-frontend-service.yaml      -> Exposes frontend pods to the cluster network
10. 09-ingress.yaml              -> Configures NGINX Ingress Controller & SSL/TLS
11. 10-hpa.yaml                  -> Autoscales pods dynamically (CPU > 70%, RAM > 80%)
12. 11-backup-cronjob.yaml       -> Nightly database snapshot job with retention
```

### 1-Command Kubernetes Deployment
Using standard Kustomize:
```bash
# Preview the generated unified manifest
kubectl kustomize k8s/

# Apply everything in sequence
kubectl apply -k k8s/

# Monitor rollout status
kubectl rollout status deployment/dukaan-backend -n dukaan-production
kubectl rollout status deployment/dukaan-frontend -n dukaan-production
```

---

## 🚀 CI/CD Pipeline (GitHub Actions)

Defined in `.github/workflows/ci-cd.yml` with automated quality gates:

1. **Stage 1 — Verify & Test:**
   - Runs TypeScript validation (`tsc`)
   - Builds production frontend bundle (`vite build`)
   - Checks backend syntax (`node -c src/index.js`)
2. **Stage 2 — Security Audit:**
   - Runs `npm audit` across client and server packages
3. **Stage 3 — Kubernetes Manifest Validation:**
   - Dry-runs `kubectl kustomize k8s/` to catch syntax or schema errors before runtime
4. **Stage 4 — Docker Multi-Stage Build & Push:**
   - Multi-arch Docker build using Buildx & layer caching (`type=gha`)
   - Pushes versioned SHA and `:latest` images to GitHub Container Registry (`ghcr.io`)
5. **Stage 5 — Zero-Downtime Deployment:**
   - Deploys updated manifests to the Kubernetes cluster
   - Enforces zero-downtime rolling update via `PodDisruptionBudget` and `maxUnavailable: 0`

---

## 💾 Disaster Recovery & Daily Backups

- **Automated Schedule:** Runs daily at 02:00 AM UTC via Kubernetes CronJob (`11-backup-cronjob.yaml`) or Docker service (`db-backup`).
- **Archive Format:** Compressed custom PostgreSQL dump (`.dump`) saved to persistent volume storage.
- **Retention Policy:** Automated 14-day rotation policy (`find ... -mtime +14 -delete`).
- **Manual Backup Trigger:**
  ```bash
  # Inside Docker
  docker exec -t dukaan-postgres-db pg_dump -U postgres -d dukaan_db -F c > backup_manual.dump
  
  # Inside Kubernetes
  kubectl create job --from=cronjob/dukaan-postgres-daily-backup manual-backup-$(date +%s) -n dukaan-production
  ```

---

## 🔒 Security & Hardening Checklist

- [x] **Non-Root Execution:** Frontend runs as unprivileged `nginx` (UID 101); backend runs as `node` (UID 1000).
- [x] **Row-Level Security (RLS):** Enforced on user records, orders, and addresses.
- [x] **Secret Isolation:** Database passwords, JWT keys, and credentials separated from image builds via Kubernetes Secrets.
- [x] **HTTP Headers:** `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.
- [x] **High Availability:** Minimum 3 replicas across disparate nodes with pod anti-affinity.
