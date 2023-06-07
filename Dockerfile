FROM node:18
WORKDIR /app
COPY . .
# RUN mkdir /root/.ssh
# ADD ./.ssh/ /root/.ssh
# RUN chown node:node /app package.json yarn.lock
# USER node
# RUN useradd nodeUser
# RUN su - nodeUser
# RUN mkdir ~/.ssh/
# RUN cd ~/.ssh && ssh-keygen -t rsa -N '' -f ~/.ssh/id_rsa

RUN npm install yarn --legacy-peer-deps

# RUN touch ~/.ssh/known_hosts
# RUN ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts
# RUN eval $(ssh-agent)

RUN git config --global url."https://github.com/".insteadOf git@github.com:
RUN git config --global url."https://".insteadOf ssh://git

RUN yarn install 
CMD ["yarn", "dev"]
EXPOSE 5173