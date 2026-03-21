FROM node:20-bullseye AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

COPY --from=build /app/dist/sakai-ng /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
