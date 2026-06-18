# DevBattle Architecture

## System Overview
DevBattle is a high-performance, massively scalable competitive programming platform. It is designed to handle 100,000+ registered users and 10,000+ concurrent users with thousands of code submissions per hour.

## Core Components

### 1. API Gateway / Ingress Controller
- **Tool**: NGINX Ingress
- **Role**: Routes external traffic to appropriate microservices/pods. Handles SSL termination and global rate limiting.

### 2. Frontend Layer (Next.js)
- **Role**: Server-Side Rendering (SSR) and Client-Side React application.
- **Scaling**: Horizontally scales within Kubernetes (HPA based on CPU).
- **Asset Delivery**: Static assets and user uploads are designed to be served via CDN.

### 3. Backend "Modular Monolith" (Node.js/Express)
- **Role**: Currently deployed as a single scalable service, but logically partitioned into Auth, Problem, Judge, and Team domains.
- **Scaling**: Horizontal scaling using Kubernetes HPA. Stateless design allows for infinite pods.

### 4. Code Execution Engine
- **Role**: Securely executes user code in isolated Docker environments.
- **Tool**: Advanced Docker container orchestration over socket streams.

### 5. Caching & Queue Layer (Redis)
- **Role**: Dramatically reduces database load by caching frequently accessed endpoints (e.g. Leaderboards, Problems). Also acts as a message broker for async task queues (e.g., Background Sync, Notification Queues).

### 6. Database Layer (MongoDB)
- **Role**: Persistent data storage.
- **Scaling**: Deployed as a Replica Set across multiple availability zones.

### 7. Observability Stack
- **Prometheus**: Time-series metrics collection from Node.js and Kubernetes nodes.
- **Grafana**: Visual dashboards for health and traffic monitoring.

## Request Flow
1. User -> DNS -> Load Balancer
2. Load Balancer -> NGINX Ingress
3. NGINX Ingress -> (Cache Hit? Return) -> Next.js Frontend or Node.js Backend
4. Node.js Backend -> (Cache Hit? Return) -> MongoDB
5. (If submission) Node.js Backend -> Execution Engine -> Docker Container
