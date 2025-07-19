# Etapa base
FROM node:18

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto definido en .env
EXPOSE 5050

# Comando para iniciar el servidor
CMD ["node", "server.js"]
