FROM node:10

ENV NODE_ENV production

ENV PORT 8765

ADD dist /usr/bin/slack-bot
ADD node_modules /usr/bin/slack-bot/node_modules
WORKDIR /usr/bin/slack-bot

# Make web server port available to the world outside this container
EXPOSE 8765

# Do it!
CMD ["node", "main.js"]
