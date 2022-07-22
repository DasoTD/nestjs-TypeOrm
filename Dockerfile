FROM node:18-alpine

WORKDIR /usr/src/app

#COPY package.json package-lock.json ./

# RUN npm i

COPY package*.json ./

RUN npm ci

COPY . .


# Run build
RUN npm run build

# RUN npm run start:prod

CMD [ "node", "dist/main.js" ]