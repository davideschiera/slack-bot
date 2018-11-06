"use strict";
/**
 * Helpers for configuring a bot as an app
 * https://api.slack.com/slack-apps
 */
Object.defineProperty(exports, "__esModule", { value: true });
const botkit_1 = require("botkit");
const bots = {};
function _trackBot(bot) {
    bots[bot.config.token] = bot;
}
function die(err) {
    console.log(err);
    process.exit(1);
}
function configureApp(port, clientId, clientSecret, clientSigningSecret, clientVerificationToken, botConfig, onInstallation) {
    const appConfig = {
        clientId,
        clientSecret,
        scopes: ['bot'],
        redirectUri: null,
    };
    const controller = botkit_1.slackbot(Object.assign({}, botConfig, {
        clientSigningSecret,
        clientVerificationToken,
    })).configureSlackApp(appConfig);
    controller.setupWebserver(process.env.PORT, (err, webserver) => {
        controller.createWebhookEndpoints(webserver);
        controller.createOauthEndpoints(webserver, (createOauthEndpointsErr, req, res) => {
            if (createOauthEndpointsErr) {
                res.status(500).send('ERROR: ' + createOauthEndpointsErr);
            }
            else {
                res.send('Success!');
            }
        });
    });
    controller.on('create_bot', (bot, config) => {
        if (bots[bot.config.token]) {
            // already online! do nothing.
        }
        else {
            bot.startRTM(function (err) {
                if (err) {
                    die(err);
                }
                _trackBot(bot);
                if (onInstallation) {
                    onInstallation(bot, config.createdBy);
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
            if (teams[t].bot) {
                const bot = controller.spawn(teams[t]).startRTM((startRTMError) => {
                    if (startRTMError) {
                        console.log('Error connecting bot to Slack:', startRTMError);
                    }
                    else {
                        _trackBot(bot);
                    }
                });
            }
        }
    });
    return controller;
}
exports.configureApp = configureApp;
//# sourceMappingURL=configureApp.js.map