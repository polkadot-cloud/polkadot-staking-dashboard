FROM node:buster as BUILDER

WORKDIR /app
COPY . .
RUN apt update && apt install -y git
RUN yarn install && yarn build

# --------------------------------------------------
FROM nginx

COPY --from=BUILDER /app/build /usr/share/nginx/html

EXPOSE 80
