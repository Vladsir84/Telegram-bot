const TelegramApi = require("node-telegram-bot-api");
const {gameOptions, againOptions} = require('./options');

const token = "6919905627:AAE1tsf8bQH1b756O-8s-dWZS5AwlmxRCBQ";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    "Now I will guess a number from 0 to 9 and you must guess it."
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Guess", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Greeting" },
    { command: "/info", description: "To get information about user" },
    { command: "/game", description: "Guess the number" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp"
      );
      return bot.sendMessage(chatId, `Welcome to VSbot!`);
    }

    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `Your name is ${msg.from.first_name} ${msg.from.last_name}`
      );
    }

    if (text === "/game") {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, "I don't understand you. Please try again.");
  });
  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === "/again") {
      return startGame(chatId);
    }

    if (data == chats[chatId]) {
      return await bot.sendMessage(
        chatId,
        `Congratulations, you guessed the number ${chats[chatId]}!`,
        againOptions
      );
    } else {
      return await bot.sendMessage(
        chatId,
        `Sorry, you didn't guess the number ${chats[chatId]} correctly`,
        againOptions
      );
    }
  });
};

start();
