# slack-bot

Slack Bot boilerplate

Based on the [Slack Bot Getting started](https://api.slack.com/tutorials/easy-peasy-bots).


## Why?

The Slack tutorial is super straightforward, but I was missing a couple of things:

1. [Typescript](https://www.typescriptlang.org/), just to feel a little bit safer
2. A [containerized application](https://www.docker.com/)


## How?

First, you need to configure the Slack application:

1. Go to https://api.slack.com/apps/new and fill out the form
2. Make sure you configure the **Redirect URL** to `https://your-slack-app-ip/oauth`
3. Add a bot to the app by navigating to **Bot User**

Second, you need to build the application:

4. Build the code: `npm install && npm run build`
5. Build the image: `docker build -t my-slack-bot:0.1 .`

Finally, you can start the application:

6. Take a note of *Client ID*, *Client Secret*, *Signing Secret* and *Verification Token* from the Basic Information page of your application on Slack
7. Run the image:
  ```
  docker run \
    -d \
    -p8765:8765 \
    -e CLIENT_ID=xxx \
    -e CLIENT_SECRET=xxx \
    -e CLIENT_SIGNIGN_SECRET=xxx \
    -e CLIENT_VERIFICATION_TOKEN=xxx \
    my-slack-bot:0.1
  ```

One more thing. You need to install the bot on a team. You can do so by visiting the URL `https://your-slack-app-ip/login` and follow the instructions.

---

👏  You can take it from here!