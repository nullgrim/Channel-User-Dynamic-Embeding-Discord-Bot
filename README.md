# Channel & User Dynamic Embedding Discord Bot
As the name would suggest, this is a Discord bot written in Node.js that embeds multiple messages across multiple servers.
If you ever wanted to be able to run a simple prefixed command unique to a user in order to create an embedded message response then simultaneously parse it to multiple channels across discord servers, this bot will do just that with ease.

## How does it work?
You may of already noticed the "users" directory, inside the directory we create user specific directories (by this I just mean we name the folders their Discord ID). Now inside I've left a little example, but to keep it simple we can create command based files, inside of the command based files we can specify the command, command aliases, message, arguments and the embed, also there is a config file per user to personalize prefix too!

By utilizing the webhooks on discord we are capable of sending messages across multiple servers without the bot being part of the server, every command has a "webhooks" array to specify where the message should be sent.

## Getting Started

### Requirements:
* **NodeJS**
```npm i npm@latest -g```
* **File-System**
```npm i file-system```
* **Path**
```npm i path```
* **Discord Webhook Node**
```npm i path```

Add your Discord Bot Token in the `config.json` file located in the `util` directory.
You can add new users to the bot simply by cloning existent directories or creating new ones, then rename the folder to their Discord ID.

Every user directory should have a `config.json` file of which contains a `prefix`, the prefix can be personalized per user.
You can create more commands simply by cloning the `template` file and editing them accordingly.

Your embed should always be returned as `webHookMessage`.
