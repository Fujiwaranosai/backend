FROM node:14.17.0

WORKDIR /app
COPY . .

RUN npm config set unsafe-perm true
RUN npm ci
RUN npm run build

WORKDIR /app/dist

CMD ["node", "main"]
