import { dirname, importx } from "@discordx/importer";
import { PrismaClient } from "@prisma/client";
import type { Interaction, Message } from "discord.js";
import { IntentsBitField } from "discord.js";
import { Client } from "discordx";
import { configDotenv } from "dotenv";
import express from "express";

configDotenv();

let LOGGING_IDS = [];
const MAX_PROMPTS = 2000;

export const bot = new Client({
  // To use only guild command
  // botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],

  // Discord intents
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.MessageContent,
  ],

  // Debug logs are disabled in silent mode
  silent: true,

  // Configuration for @SimpleCommand
  simpleCommand: {
    prefix: "y.",
  },
});

function getChanceHit(percentage: number) {
  return Math.random() < percentage;
}

function getMinMax(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function addMessagePrompt(guildId: string, prompt: string) {
  const prisma = new PrismaClient();

  const guild = await prisma.guilds.findUnique({
    where: {
      guildId,
    },

    select: {
      prompts: true,
    },
  });

  // split prompts with spaces, add to existing prompts immediately
  const newPrompts = guild.prompts;
  const promptsSplit = prompt.split(" ");

  for (const promptVal of promptsSplit) {
    newPrompts.push(promptVal);
  }

  // restrict to MAX_PROMPTS
  // remove amount added from behind, keep the rest
  // [1, 2, 3] -> [1, 2, 3, 4] -> [2, 3, 4] (slice(1, 3 + 1))
  newPrompts.slice(promptsSplit.length, MAX_PROMPTS + promptsSplit.length);

  // update prompts
  await prisma.guilds.update({
    where: {
      guildId,
    },

    data: {
      prompts: {
        set: newPrompts,
      },
    },
  });

  await prisma.$disconnect();
}

async function getMessagePrompt(guildId: string): Promise<string> {
  const prisma = new PrismaClient();

  const guild = await prisma.guilds.findUnique({
    where: {
      guildId,
    },

    select: {
      prompts: true,
    },
  });

  let finalPrompt = "";

  for (let i = 0; i < getMinMax(0, 100); i++) {
    finalPrompt +=
      guild.prompts[Math.floor(Math.random() * guild.prompts.length)];
  }

  await prisma.$disconnect();

  return finalPrompt;
}

async function setupSpotify() {
  console.log(`Setting up Spotify...`);

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = `${process.env.SPOTIFY_REFRESH_TOKEN}`;
  const url = "https://accounts.spotify.com/api/token";

  async function updateAccessToken() {
    const payload = {
      method: "POST",

      headers: {
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },

      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: clientId,
      }),
    };
    const body = await fetch(url, payload);
    const response = await body.json();

    if (response.error) {
      console.log(`Error updating Spotify credentials, error shown below`);

      console.log(response);

      process.exit(1);
    }

    process.env.SPOTIFY_ACCESS_TOKEN = response.access_token;

    return response as {
      access_token: string;
      token_type: string;
      expires_in: number;
    };
  }

  const res = await updateAccessToken();

  setInterval(() => {
    updateAccessToken();
  }, res.expires_in * 1000); // in ms

  console.log(`Spotify credentials setup.`);
}

function setupKeepAlive() {
  console.log("Starting keep alive server...");

  const app = express();

  app.get("/keep-alive", (_, res) => {
    res.status(200).send("Luh Geeky");
  });

  app.listen(process.env.PORT || 3000);

  console.log(`Keep alive server enabled.`);
}

function showYeatASCII() {
  console.log(`+=============--------------=======-===============
=========-----------------==%@@@%==---------=======
======-------------------==%@@@@@@#=-----------====
===----------------------+@@@@@@@@@#=-------------=
=---------------====--==#@@@@%%%%%@@@+=-----=------
-------------+%@%@@##+=#@@@@@%%%%%%%@@@%#@@@@%=----
------------%@@@@@@#+===#%@@@@@@@@@@@%====#@@@@%=--
-----------=%@@@@@@@@@%@@@@@%@@@@@@@@@@%#@@@@@@%=--
-----------%%%%%%%%%%%@@@@@%#@@@%#%@@@%@%%%@@@%=---
-----------=#%%%#++%%#%@@@@@@@@@@@@@%%@@#%%%%%=----
-------------------%@%#%@@#%@@@@###%%@@%=----------
-------------------##%@%%%@%@@@@%%@@@@%@+----------
-------------------#%#%@@@%@@@@@@%%%@#@@+----------
-------------------#@%###@@@@@@@@@%#%#@%#----------
-------------------*%#@@%#%@@@@@@@%@@@%@%----------
-------------------%@##@@@#@@#%@@@@####@@----------
------------------=%@%#+*%%#*+*%%@@@##@%@=---------
------------------+@%%@%+#**++*%%@@%%%%%@=---------
------------------+@@*+%##%*%##%**%@@#*@%----------
------------------+@@@##++@@@%%%%#@#@#@@@----------
------------------+@%@#+=*@@@%%@%%*@%%#*@----------
------------------+@@##+=*@@*%%@@*%@@@%@%----------
------------------#@@%#+#%@#+%%%%#%*+#%@@=---------
------------------%@@#*+%%@=+%%@+##==#%@%----------
-----------------=%@%@@%%@*=*%#@@@===%@@=----------
-----------------=#@%@#*%@==+%@%@@=-+%@=-----------
-----------------=#%%@%%@%=-+@@##%--+%+------------
------------------*#*%%%@*--+@@*%*-----------------
--------------------#%+%%+--+%%*@+----------------=
========--=--------=%%#@@=--*@@#@+-================
===========-=--=---=%%#%#=-=%@%#%---===============
==------------------*##%+--=#%#%=----------========
-------------------+@@@@#---%@@@@%=--------------==
-----------------+%@@@@@%+--%@@@@@%----------------
----------------+#%%@@%%%=---+%%#%+----------------
------------------++++=----------------------------
  `);
}

async function setupMongo() {
  console.log(`Setting up MongoDB...`);

  const prisma = new PrismaClient();

  await prisma.guilds.create({
    data: {
      guildId: "0",
      logging: false,
    },
  });

  await prisma.guilds.delete({
    where: {
      guildId: "0",
    },
  });

  // Fetch all guild ids that require logging
  const guilds = await prisma.guilds.findMany({
    where: {
      logging: true,
    },

    select: {
      guildId: true,
    },
  });

  await prisma.$disconnect();

  LOGGING_IDS = guilds.map((v) => v.guildId);

  console.log(`MongoDB setup complete.`);
}

bot.once("ready", async () => {
  // Synchronize applications commands with Discord
  await bot.initApplicationCommands();

  if (!process.env.DATABASE_URL) {
    console.log(`DATABASE_URL not found in the environment, exiting.`);
    process.exit(1);
  }

  await setupMongo();

  if (process.env.SPOTIFY_REFRESH_TOKEN) {
    await setupSpotify();
  }

  // Keep alive if needed
  if (process.env.KEEP_ALIVE.toLowerCase() == "true") {
    setupKeepAlive();
    showYeatASCII();
  }

  console.log("Yeat is cookin'");
});

bot.on("interactionCreate", (interaction: Interaction) => {
  bot.executeInteraction(interaction);
});

bot.on("messageCreate", async (message: Message) => {
  // No simple commands in this instance, comment
  // await bot.executeCommand(message);

  // ignore bots
  if (message.author.bot) return;

  const guildId = message.guild.id;

  // toggle ran, must check in realtime
  if (process.env.RERUN_CHECKS_FOR == guildId) {
    if (LOGGING_IDS.includes(guildId)) {
      LOGGING_IDS.filter((v) => v != guildId);
    } else {
      LOGGING_IDS.push(guildId);
    }
  }

  // no more checks
  if (!LOGGING_IDS.includes(guildId)) return;

  // add to prompts
  await addMessagePrompt(guildId, message.content);

  async function attemptMessageReply() {
    // 1 in 10 chance we reply
    if (getChanceHit(0.1)) {
      await replyMessage();
    }
  }

  async function replyMessage() {
    // get prompt and send
    await message.reply(await getMessagePrompt(guildId));
  }

  // maybe reply if not mentioned, otherwise do it surely
  if (message.mentions.has(bot.user.id)) {
    await replyMessage();
  } else {
    await attemptMessageReply();
  }
});

async function run() {
  // The following syntax should be used in the commonjs environment
  //
  // await importx(__dirname + "/{events,commands}/**/*.{ts,js}");

  // The following syntax should be used in the ECMAScript environment
  await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`);

  // Let's start the bot
  if (!process.env.BOT_TOKEN) {
    throw Error("Could not find BOT_TOKEN in your environment");
  }

  // Log in with your bot token
  await bot.login(process.env.BOT_TOKEN);
}

void run();
