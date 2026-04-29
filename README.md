# gRPC Microservices Demo 🚀

A production-ready microservices architecture built with **Node.js**, **gRPC**, and **TypeScript**, deployed on **AWS EKS** with a fully automated **CI/CD** pipeline.

## 🏗 Architecture Overview

This project consists of three core services and a centralized logging/tracing system:

1.  **API Gateway**: The entry point for all client requests. Handles HTTP-to-gRPC translation, authentication, rate limiting, and request tracing.
2.  **User Service**: Manages user profiles and authentication using **MongoDB** and **InversifyJS** for dependency injection.
3.  **Order Service**: Handles order lifecycle and state transitions using **PostgreSQL** (via **Prisma**) and a robust domain state machine.

### Key Features
*   **gRPC Communication**: High-performance, type-safe inter-service communication.
*   **Distributed Tracing**: Automated `Correlation ID` propagation across all services.
*   **Domain State Machine**: Strict enforcement of order status transitions (e.g., `SHIPPED` → `DELIVERED`).
*   **CI/CD Pipeline**: Parallel Docker builds and automated EKS deployments with failure rollbacks.
*   **Production Ready**: Integrated health checks, non-root users in Docker, and LoadBalancer integration.

---

## 🛠 Tech Stack
*   **Runtime**: Node.js 22 (Alpine)
*   **Languages**: TypeScript
*   **Protocols**: gRPC, HTTP/REST
*   **Databases**: MongoDB (Users), PostgreSQL (Orders)
*   **ORM**: Prisma
*   **Infrastructure**: AWS EKS, Docker Hub
*   **CI/CD**: GitHub Actions

---

## 🚀 Getting Started

### Local Development (Docker Compose)
To run the entire stack locally with databases:
```bash
docker-compose up --build
```
The API Gateway will be available at `http://localhost:3000`.

### Local Development (Manual)
If you want to run services individually:
1.  **Databases**: Ensure MongoDB (27017) and Postgres (5432) are running.
2.  **Install Dependencies**: `pnpm install` in all service directories.
3.  **Start Services**:
    ```bash
    cd user-service && pnpm run dev
    cd order-service && pnpm run dev
    cd api-gateway && pnpm run dev
    ```

---

## 🚢 Deployment (CI/CD)

The project uses GitHub Actions for automated deployment to AWS EKS.

### Required GitHub Secrets
Ensure the following secrets are configured in your repository:
*   `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`
*   `DOCKER_USERNAME` / `DOCKER_PASSWORD`
*   `JWT_SECRET`: Minimum 10 characters.
*   `MONGODB_URI`: Internal K8s connection string.
*   `DATABASE_URL`: Internal K8s connection string.

### Pipeline Logic
*   **Build**: Parallel builds for all 3 services using a matrix strategy.
*   **Tagging**: Branch-based tagging (e.g., `:main`, `:develop`).
*   **Deploy**: Automatic `kubectl apply` with dynamic image tag synchronization.
*   **Rollback**: If deployment fails, `kubectl rollout undo` is automatically triggered.

---

## 📡 API Reference

### User Service
*   `POST /api/v1/users/register`: Register a new user.
*   `POST /api/v1/users/login`: Authenticate and receive a JWT.

### Order Service (Protected)
*   `GET /api/v1/orders/`: List current user's orders.
*   `POST /api/v1/orders/`: Create a new order.
*   `PATCH /api/v1/orders/:id/status`: Update order status (Admin only).

---

## 🔍 Observability

Every request is assigned a unique `x-correlation-id`. This ID is:
1.  Generated/Extracted at the **API Gateway**.
2.  Forwarded via gRPC metadata to **User/Order Services**.
3.  Automatically injected into every log entry using **Pino**.

To trace a request across services, simply grep for the correlation ID in your logs:
```bash
kubectl logs -l app=user-service | grep <CORRELATION_ID>
```

---

## ⚖️ License
MIT
