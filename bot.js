const botkit = require('botkit');// module import
const schedule = require('node-schedule');
const moment = require('moment');
const rtmClient = require('slack-client').RtmClient;

const token = '';
const rtm = new rtmClient(token, {logLevel: 'error'});

const controller = botkit.slackbot({
  debug: false,
  log: true
});

const botScope = [
  'direct_message',
  'direct_mention',
  'mention'
];

controller.spawn({
  token
}).startRTM();

rtm.start();

controller.hears(['출근'], botScope, (bot, replyMessage) => {
  const currentTime = moment().format('HH:mm').split(':');// ex) 13,30
  const quittingHour = parseInt(currentTime[0]) + 9;
  const quittingMinute = currentTime[1];

  bot.reply(replyMessage, '출근 시간은 ' + currentTime[0] + ':' + currentTime[1] + ' 입니다. ' +
    '퇴근 시간은 ' + quittingHour+ ':' + quittingMinute + ' 입니다.');// 9 = 근무시간, quittingMinute은 00분 포맷 맞추기위해 parseInt안함

  schedule.scheduleJob({hour: quittingHour, minute: parseInt(quittingMinute)}, () => { // 퇴근 시간에 알림
    bot.reply(replyMessage,"퇴근 시간입니다.");
  });
});