FROM ubuntu:22.04 as builder

# Install any needed packages
RUN apt-get update && \
  apt-get install --no-install-recommends -y curl git gnupg ca-certificates

# install nodejs
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install --no-install-recommends -y nodejs build-essential && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /apps
COPY . .

RUN npm install --legacy-peer-deps
RUN NODE_ENV=production REACT_APP_DISABLE_FIAT=1 npm run build

# ===========================================================
FROM nginx:stable-alpine

WORKDIR /usr/share/nginx/html

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /apps/build /usr/share/nginx/html
