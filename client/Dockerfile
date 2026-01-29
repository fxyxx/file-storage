# =============================================
# Stage 1: Dependencies
# =============================================
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# =============================================
# Stage 2: Builder
# =============================================
FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time variables for Vite
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Compile a production build
RUN npm run build

# =============================================
# Stage 3: Production (nginx)
# =============================================
FROM nginx:alpine AS production

# Remove the default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/

# Copy the collected static files
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
