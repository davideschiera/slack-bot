import { configureApp } from './lib/configureApp';
import { SlackBot } from 'botkit';

const config = {
  json_file_store: './db_slack_bot_a/',
};

//
// Define a function for initiating a conversation on installation
//
function onInstallation(bot: SlackBot, installer) {
  if (installer) {
    bot.startPrivateConversation({ user: installer }, (err, convo) => {
      if (err) {
        console.log(err);
      } else {
        convo.say('I am a bot that has just joined your team');
        convo.say('You must now /invite me to a channel so that I can be of use!');
      }
    });
  }
}

const controller = configureApp(
  process.env.PORT,
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.CLIENT_SIGNING_SECRET,
  process.env.CLIENT_VERIFICATION_TOKEN,
  config,
  onInstallation,
);

// Handle events related to the websocket connection to Slack
controller.on('rtm_open', (bot) => {
  console.log('** The RTM api just connected!');
});

controller.on('rtm_close', (bot) => {
  console.log('** The RTM api just closed');
  // you may want to attempt to re-open
});

//
// Core bot logic goes here!
//
controller.on('bot_channel_join', (bot, message) => {
  bot.reply(message, 'I\'m here!');
});

controller.hears('hello', 'direct_message', (bot, message) => {
  bot.reply(message, 'Hello!');
});

controller.on('direct_message,mention,direct_mention', (bot, message) => {
  bot.api.reactions.add(
    {
      timestamp: message.ts,
      channel: message.channel,
      name: 'robot_face',
    },
    (err) => {
      if (err) {
        console.log(err);
      }
      bot.reply(message, 'I heard you loud and clear boss.');
    },
  );
});
