module.exports = {
  name: "test", // Commad name
  aliases: ["te", "t"], // Command aliases
  webhooks: [
    "https://discord.com/api/webhooks/8035.../VsR...",
    "https://discord.com/api/webhooks/8035.../01DG..."
  ], // Webhooks;
  async execute(message, args, MessageBuilder) {

    /* Edit everything in here, always */

    // * You can send any message you want, curretly this is an example;
    // * This will parse and build an embed message based on arguments;
    // * We can also parse an optional comment that will join up the rest of the arguments;
    // * You may customize these messages to your linking;

    const description = [
      `Argument 1: ${args[0]}`,
      `Argument 2: ${args[1]}`,
      `Argument 3: ${args[2]}`,
      `Argument 4: ${args[3]}`,
      `Argument 5: ${args[4]}`,
      `Argument 6: ${args[5]}`,
    ]

    // * Simple check to ensure that all the arguments are provided;
    if (!args || args.length < description.length) return {
      error: message.reply(`this command requires \`${description.length}\` arguments, please provide \`${description.length - args.length}\` more arguments.`)
    };

    // * Joins up all of the arguments after the 6th argument for a comment;
    const comment = args.splice(description.length, args.length).join(' ');

    // * Simple check for comment since we want it to be optional;
    if (comment) {
      // * Push the comment into the array;
      description.push(`**[💬] Comment:** ${comment}`);
    }

    /* Building the Embed */
    let webHookMessage = new MessageBuilder()
      .setColor('#FFFF00') // Specify color (#HEX);
      .setTitle('Example Title') // Embed Title;
      .setDescription(description.join('\n')) // Parse in the "description" array;
      .setThumbnail('https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png') // Image;
      .setTimestamp() // Timestamp;
      .setFooter('Test Footer', 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png'); // Footer and Footer Image;

    return {
      webHookMessage // Returns our built messagse;
    };
  }
};