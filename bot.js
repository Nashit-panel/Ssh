const TelegramBot = require('node-telegram-bot-api');
const { exec } = require('child_process');

// Get credentials from environment variables
const TOKEN = process.env.BOT_TOKEN || '8478682445:AAF90qG8NwFZMU-P1_71KmRQS_g4GqQvw6Y';
const ADMIN_ID = process.env.ADMIN_ID || '7582395656';

// Create the bot
const bot = new TelegramBot(TOKEN, { polling: true });
console.log("🤖 Telegram bot started...");

// Restrict access
function isAdmin(msg) {
  return msg.from.id.toString() === ADMIN_ID;
}

// Start command
bot.onText(/\/start/, (msg) => {
  if (!isAdmin(msg)) return;
  bot.sendMessage(msg.chat.id, "✅ Bot is online!\nCommands:\n/cmd <command> — Run any shell command\n/update — Update system packages");
});

// Run any shell command
bot.onText(/\/cmd (.+)/, (msg, match) => {
  if (!isAdmin(msg)) return;
  const chatId = msg.chat.id;
  const command = match[1];

  bot.sendMessage(chatId, `⏳ Running command: \`${command}\``, { parse_mode: 'Markdown' });

  exec(command, { shell: '/bin/bash' }, (error, stdout, stderr) => {
    if (error) {
      bot.sendMessage(chatId, `❌ Error:\n${error.message}`);
      return;
    }
    if (stderr.trim()) {
      bot.sendMessage(chatId, `⚠ Stderr:\n${stderr}`);
    }
    bot.sendMessage(chatId, `📄 Output:\n${stdout || 'No output'}`);
  });
});

// Update system
bot.onText(/\/update/, (msg) => {
  if (!isAdmin(msg)) return;
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "🔄 Updating system packages...");

  exec('apt update && apt upgrade -y', { shell: '/bin/bash' }, (error, stdout, stderr) => {
    if (error) {
      bot.sendMessage(chatId, `❌ Error:\n${error.message}`);
      return;
    }
    bot.sendMessage(chatId, `✅ Update completed!\n📄 Output:\n${stdout}`);
  });
});
