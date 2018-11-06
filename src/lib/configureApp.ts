/**
 * Helpers for configuring a bot as an app
 * https://api.slack.com/slack-apps
 */

import { SlackBot, slackbot } from 'botkit';

interface IBotEx extends SlackBot {
  config: { token: string };
}

interface IConfigEx {
  createdBy: string;
}

const bots = {};

function _trackBot(bot) {
  bots[bot.config.token] = bot;
}

function die(err) {
  console.log(err);
  process.exit(1);
}

export function configureApp(
  port,
  clientId,
  clientSecret,
  clientSigningSecret,
  clientVerificationToken,
  botConfig,
  onInstallation,
) {
  const appConfig = {
    clientId,
    clientSecret,
    scopes: ['bot'], // TODO it would be good to move this out a level, so it can be configured at the root level

    redirectUri: null,
  };

  const controller = slackbot(
    Object.assign({}, botConfig, {
      clientSigningSecret,
      clientVerificationToken,
    }),
  ).configureSlackApp(appConfig);

  controller.setupWebserver(process.env.PORT, (err, webserver) => {
    controller.createWebhookEndpoints(webserver);

    controller.createOauthEndpoints(webserver, (createOauthEndpointsErr, req, res) => {
      if (createOauthEndpointsErr) {
        res.status(500).send('ERROR: ' + createOauthEndpointsErr);
      } else {
        res.send('Success!');
      }
    });
  });

  controller.on('create_bot', (bot, config) => {
    if (bots[(bot as IBotEx).config.token]) {
      // already online! do nothing.
    } else {
      bot.startRTM(function(err) {
        if (err) {
          die(err);
        }

        _trackBot(bot);

        if (onInstallation) {
          onInstallation(bot, (config as IConfigEx).createdBy);
        }
      });
    }
  });

  controller.storage.teams.all((error, teams) => {
    if (error) {
      throw error;
    }

    // connect all teams with bots up to slack!
    for (const t in teams) {
      if ((teams[t] as any).bot) {
        const bot = controller.spawn(teams[t] as any).startRTM((startRTMError) => {
          if (startRTMError) {
            console.log('Error connecting bot to Slack:', startRTMError);
          } else {
            _trackBot(bot);
          }
        });
      }
    }
  });

  return controller;
}
