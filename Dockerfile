FROM    node:latest
ADD     . /telegram-cli
WORKDIR /telegram-cli
RUN     npm install --production
