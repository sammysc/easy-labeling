FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: servidor web para servir os arquivos estáticos
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

# Remove a configuração padrão do nginx e adiciona uma customizada para SPA
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]