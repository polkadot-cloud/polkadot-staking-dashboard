# build environment
FROM node:18 as build
WORKDIR /app
COPY . .
RUN npm install yarn --legacy-peer-deps
RUN git config --global url."https://github.com/".insteadOf git@github.com:
RUN git config --global url."https://".insteadOf ssh://git
RUN yarn install
RUN yarn build

# production environment
FROM nginx:1.16.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
