FROM node:18.17.1-alpine as builder

ENV TERM xterm
ENV TZ Asia/Taipei

WORKDIR /home/node

COPY tsconfig*.json ./
COPY package*.json ./
RUN npm ci

COPY . .

RUN npm install
RUN npm run build demo

# ---

FROM node:18.17.1-alpine

ENV NODE_ENV production

WORKDIR /home/node

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /home/node/dist/ ./dist/

EXPOSE 3000

CMD ["npm", "run", "start:prod:demo"]
