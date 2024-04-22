import { dirname, importx } from "@discordx/importer";
import type { Interaction, Message } from "discord.js";
import { IntentsBitField } from "discord.js";
import { Client } from "discordx";
import { configDotenv } from "dotenv";
import express from "express";

configDotenv();

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

bot.once("ready", async () => {
  // Synchronize applications commands with Discord
  await bot.initApplicationCommands();

  if (process.env.SPOTIFY_REFRESH_TOKEN) {
    await setupSpotify();
  }

  // Keep alive if needed
  if (process.env.KEEP_ALIVE) {
    setupKeepAlive();
  }

  if (process.env.NODE_ENV == "production") showYeatASCII();

  console.log("Yeat is cookin'");
});

bot.on("interactionCreate", (interaction: Interaction) => {
  bot.executeInteraction(interaction);
});

bot.on("messageCreate", async (message: Message) => {
  await bot.executeCommand(message);
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
