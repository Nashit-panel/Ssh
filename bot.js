const TelegramBot = require('node-telegram-bot-api');
const { exec } = require('child_process');

// Your bot token and Telegram admin ID
const TOKEN = '8478682445:AAF90qG8NwFZMU-P1_71KmRQS_g4GqQvw6Y';
const ADMIN_ID = '7582395656';

// Create bot
const bot = new TelegramBot(TOKEN, { polling: true });
console.log("🤖 Telegram bot started...");

// Check admin
function isAdmin(msg) {
  return msg.from.id.toString() === ADMIN_ID;
}

// /start command
bot.onText(/\/start/, (msg) => {
  if (!isAdmin(msg)) return;
  bot.sendMessage(msg.chat.id, "✅ Bot is online!\nCommands:\n/cmd <command> — Run any shell command\n/update — Update system packages");
});

// Run any command
bot.onText(/\/cmd (.+)/, (msg, match) => {
  if (!isAdmin(msg)) return;
  const chatId = msg.chat.id;
  const command = match[1];

  bot.sendMessage(chatId, `⏳ Running command: \`${command}\``, { parse_mode: 'Markdown' });

  exec(command, { shell: '/bin/bash', maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
    let response = '';
    if (error) response += `❌ Error:\n${error.message}\n`;
    if (stderr.trim()) response += `⚠ Stderr:\n${stderr}\n`;
    if (stdout.trim()) response += `📄 Output:\n${stdout}`;

    if (!response) response = '✅ Command executed with no output';
    bot.sendMessage(chatId, response);
  });
});

// Update system packages
bot.onText(/\/update/, (msg) => {
  if (!isAdmin(msg)) return;
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "🔄 Updating system packages...");

  exec('sudo apt update && sudo apt upgrade -y', { shell: '/bin/bash', maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
    let response = '';
    if (error) response += `❌ Error:\n${error.message}\n`;
    if (stderr.trim()) response += `⚠ Stderr:\n${stderr}\n`;
    if (stdout.trim()) response += `📄 Output:\n${stdout}`;

    if (!response) response = '✅ Update completed with no output';
    bot.sendMessage(chatId, response);
  });
});
