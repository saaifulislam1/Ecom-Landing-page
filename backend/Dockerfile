FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run db:generate && npm run build
EXPOSE 5000
CMD ["npm", "start"]
