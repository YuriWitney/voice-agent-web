FROM node:22-alpine

WORKDIR /usr/src/app
COPY package*.json ./

COPY . .
RUN npm run build

CMD ["npm", "run", "dev"]
