FROM node:20-alpine

WORKDIR /var/www/frontend

COPY ./frontend/package.json ./frontend/package-lock.json ./
RUN npm ci

COPY ./frontend .

EXPOSE 3000

CMD ["npm", "run", "dev"]
