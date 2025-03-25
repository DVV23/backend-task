FROM node:20-alpine
WORKDIR /app
ENV PORT=3000
ENV LEGACY_API_KEY='0194ec39-4437-7c7f-b720-7cd7b2c8d7f4'
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE $PORT
CMD ["node", "src/server.js"]
