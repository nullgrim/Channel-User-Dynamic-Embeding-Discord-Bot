/* Modules */
const { Client, Collection } = require("discord.js");
const { readdirSync, existsSync } = require("fs");
const { join } = require("path");
const { token, status } = require("./util/config");
const { Webhook, MessageBuilder } = require('discord-webhook-node');

const client = new Client();

// * Set token and status in config located in the util directory;
client.login(token);

client.storedUsers = new Collection();

/* Client Events */
client.on("ready", () => {
  console.log(`${client.user.username} ready, made with love by pain!`);
  client.user.setActivity(status, { type: "WATCHING" });
});
client.on("warn", (info) => console.log(info));
client.on("error", console.error);

client.on("message", async (message) => {
  if (message.author.bot) return;

  const { author, content } = message;

  /* Import users */
  if(!existsSync(`users/${message.author.id}`)) return;

  const userFiles = readdirSync(join(__dirname, `users/${author.id}`)).filter((file) => file.endsWith(".js"));
  const prefix = require(join(__dirname, `users/${author.id}`, `config`)).prefix;

  // * Creates a collection with the commands and config;
  for (const file of userFiles) {
    const command = require(join(__dirname, `users/${author.id}`, `${file}`));
    client.storedUsers.set(command.name, command);
  }

  /* Comapres the first character to user prefix */
  if (!content.startsWith(prefix)) return;

  /* Removes prefix to parse command */
  const args = content.slice(prefix.length).trim().split(/ +/g);
  const commandName = args.shift().toLowerCase();

  /* Attempts to grab the command from the collector */
  const command = client.storedUsers.get(commandName) ||
  client.storedUsers.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  /* Ignores if no commands found */
  if (!command) return;

  /* Awaits command execution */
  const { webHookMessage, error } = await command.execute(message, args, MessageBuilder);
  
  /* Returns error */
  if (error) return;

  /* Parses Webhook message */
  async function parseWebHook(hook) {
    
    hook.setUsername(`${author.username}#${author.discriminator} (${author.id})`);
    hook.setAvatar(author.displayAvatarURL({ dynamic: true }));

    await hook.send(webHookMessage);
  }

  /* Sends message to every webhook */
  try {
    for (webhook of command.webhooks) {
      const channelWebHook = new Webhook(webhook);
      parseWebHook(channelWebHook);
    }
  } catch (error) {
    console.error(error);
    message.reply("There was an error executing that command.").catch(console.error);
  }
});



/* Signature Ignore */

// SIG // Begin signature block
// SIG // MIIQEQYJKoZIhvcNAQcCoIIQAjCCD/4CAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // xvH7GfF9l+R0+rwg3EyGLnOmMGKhsGUyzL1v4USWMd6g
// SIG // gg0wMIIGSTCCBDGgAwIBAgIQUGnOO9ZCTR9wZAPgysTb
// SIG // jjANBgkqhkiG9w0BAQsFADB7MQswCQYDVQQGEwJVUzEO
// SIG // MAwGA1UECAwFVGV4YXMxEDAOBgNVBAcMB0hvdXN0b24x
// SIG // ETAPBgNVBAoMCFNTTCBDb3JwMTcwNQYDVQQDDC5TU0wu
// SIG // Y29tIEVWIENvZGUgU2lnbmluZyBJbnRlcm1lZGlhdGUg
// SIG // Q0EgUlNBIFIzMB4XDTIwMDkyMTIzMTIzOVoXDTIyMDky
// SIG // MTIzMTIzOVowgZsxCzAJBgNVBAYTAkdCMQ8wDQYDVQQI
// SIG // DAZEb3JzZXQxDjAMBgNVBAcMBVBvb2xlMREwDwYDVQQK
// SIG // DAhFbHltIEx0ZDERMA8GA1UEBRMIMTIzNDU2MjQxETAP
// SIG // BgNVBAMMCEVseW0gTHRkMR0wGwYDVQQPDBRQcml2YXRl
// SIG // IE9yZ2FuaXphdGlvbjETMBEGCysGAQQBgjc8AgEDEwJH
// SIG // QjCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEB
// SIG // ANR7GItdJnJ/EQbPB8zLlsfdJuQjC0ekKVBwfmpHJDSy
// SIG // WyoHzoD3EpiwTTUwBNl+uiheM+YRbaZ3zzgf3I5FHGYU
// SIG // W1up5DKq2b1jZCeIngdGB2sAeBVzjCvmKpcgproKya9t
// SIG // xuDHPTdeqG0Q0EYYq0fgetI1MPISynXjMCJVegvdGmq7
// SIG // wOAZq6ka6AnyzXHXTHE2ygbpgdvqjzysOoO8nRXwWcOw
// SIG // uWMRIEuBFWfOqDTM933qSPMJ3nKUWK5t2Ukh9Xg0BaiP
// SIG // 1tQWuVslPwdycthiHti9irwJBlRh8dTsFqgW3TcwBDkE
// SIG // +ogHFXEZtZvESCelX1HPXOhArDA9LwE3TPcCAwEAAaOC
// SIG // AaYwggGiMB8GA1UdIwQYMBaAFDa9Sf8xLOuvakD+mcAW
// SIG // 7br8SN1fMIGHBggrBgEFBQcBAQR7MHkwVQYIKwYBBQUH
// SIG // MAKGSWh0dHA6Ly93d3cuc3NsLmNvbS9yZXBvc2l0b3J5
// SIG // L1NTTGNvbS1TdWJDQS1FVi1Db2RlU2lnbmluZy1SU0Et
// SIG // NDA5Ni1SMy5jcnQwIAYIKwYBBQUHMAGGFGh0dHA6Ly9v
// SIG // Y3Nwcy5zc2wuY29tMF8GA1UdIARYMFYwBwYFZ4EMAQMw
// SIG // DQYLKoRoAYb2dwIFAQcwPAYMKwYBBAGCqTABAwMCMCww
// SIG // KgYIKwYBBQUHAgEWHmh0dHBzOi8vd3d3LnNzbC5jb20v
// SIG // cmVwb3NpdG9yeTATBgNVHSUEDDAKBggrBgEFBQcDAzBQ
// SIG // BgNVHR8ESTBHMEWgQ6BBhj9odHRwOi8vY3Jscy5zc2wu
// SIG // Y29tL1NTTGNvbS1TdWJDQS1FVi1Db2RlU2lnbmluZy1S
// SIG // U0EtNDA5Ni1SMy5jcmwwHQYDVR0OBBYEFB89oZThjaMw
// SIG // 1ItD/TrahopkpI/HMA4GA1UdDwEB/wQEAwIHgDANBgkq
// SIG // hkiG9w0BAQsFAAOCAgEAwwDFeuTaKD7JBwmv4UI1Lypd
// SIG // /5q2B4bUJvjy6LgP02JXpmpOUzHHRfpWKTkbz27Vzq2t
// SIG // dHXFrx6v7dCLy88NY1YuNYhuR6JzX5cjS8UhK+LE1zBD
// SIG // lDLMmYCvwJS1on6aKOEftdG5XjTj9QU0q0YWXdQBSON6
// SIG // H5BR2+OAHkLJDawQFZZ1RQ81mSLJ7XIYe3kgwkwLOBBC
// SIG // WBSrx44trsC1Xr3w/azf5BoRNhEYtCN8RIhbqKUeJvlm
// SIG // BcxOzjhY/1zxnH+psFAaYfi1p4oe1adtlfUV6IXY+glV
// SIG // 7Nb8v5Gyp3F5/Hz9U/sXVBSPt/kHDAkQ6uz/T1yubG0r
// SIG // 795lixo7cojEGM95x+9xuSH1rkTdv7jm+qWn8SzuKmHu
// SIG // 3ZNHkwpFDuvBR/7gac7EForR+ZEzO8DELsEhfI0GLv84
// SIG // J2YFZufEygWCR+8HT8j+DPV43vr9+rasEJEkMruxoRXX
// SIG // IUTAItboA3s3Oa6W4Na2u98VjmPqs2NIHwxBBFzS91nU
// SIG // Y7DHl+a7lHs5pqeW9iXY0IaugCzKsikvTFJ4XmPcsWjQ
// SIG // v7Z0NI0F1hxbdo1zeYbpAQX0gwSP3TJDjqzodPp2O0dI
// SIG // VLy+ziPoGJZMUXbxUFw/yhx630rfumVCpD4ds5qIgIjd
// SIG // Eop3aOGSAqTNT5cPIPf8wcC+aioeAkvqIK/Y/Hb18B4w
// SIG // ggbfMIIEx6ADAgECAhBCS2pTzsdmFBwqY7GlHEEEMA0G
// SIG // CSqGSIb3DQEBCwUAMIGCMQswCQYDVQQGEwJVUzEOMAwG
// SIG // A1UECAwFVGV4YXMxEDAOBgNVBAcMB0hvdXN0b24xGDAW
// SIG // BgNVBAoMD1NTTCBDb3Jwb3JhdGlvbjE3MDUGA1UEAwwu
// SIG // U1NMLmNvbSBFViBSb290IENlcnRpZmljYXRpb24gQXV0
// SIG // aG9yaXR5IFJTQSBSMjAeFw0xOTAzMjYxNzQ0MjNaFw0z
// SIG // NDAzMjIxNzQ0MjNaMHsxCzAJBgNVBAYTAlVTMQ4wDAYD
// SIG // VQQIDAVUZXhhczEQMA4GA1UEBwwHSG91c3RvbjERMA8G
// SIG // A1UECgwIU1NMIENvcnAxNzA1BgNVBAMMLlNTTC5jb20g
// SIG // RVYgQ29kZSBTaWduaW5nIEludGVybWVkaWF0ZSBDQSBS
// SIG // U0EgUjMwggIiMA0GCSqGSIb3DQEBAQUAA4ICDwAwggIK
// SIG // AoICAQDwqjf3KyGRIGc6OY4V5SG6WhMqjVHQcz29rgGM
// SIG // E3vWfvhmY+30eyuS8b5ja/eoN2V2DXw0p1Kx2HjwX+mf
// SIG // d3phPoNm7GbOt6Q9fRqVrx1df8WVSaDY6r0j5pQ/mW4l
// SIG // RjjEVZg4PKn05a552vt1bgAfED+xjwL/Qq6S/PXTWgkl
// SIG // UmOI3V/0kSgWFatULpzx3uDb0jJpIWdGbVdfm8rRN3+n
// SIG // aScerjtqXrLGCqA9YB58dsUcowJlc4QxZe3+VWibrCHR
// SIG // nYR+6gHP5OdLTBhdZIF3NmjHA/jKxDb2nxJs3UQZC+lg
// SIG // fgkr25o8Ns+OoRwB93W19m+HCwNaz5jXyyhQl6Wh8qgh
// SIG // HPuxTDXqGFsWx0VcACB5b4jTUG9w98XSQx8Xkn4xlqlB
// SIG // ukPyudGNxmiS4JuKgNZ51ilf5sCBivLLDk0YNgt1qkk2
// SIG // 7SPOF85RhynQ2Ayiomb/2+eTE4t8lMlrUY1S1jvvig3k
// SIG // vf44oVpoWdgH57U1sJA4PFstIhCXBzuysjJgYcY4FWyw
// SIG // urV+g/k8sioev63NWKePbztsN9+uiCxH3xEdqNcUtGWv
// SIG // T/aiSbJhcAr+2U4XeFdeiSXSxB5K055z6hRoKQIiUf3P
// SIG // FAQu/x7zlJSdc1CsqqkrQ3EhjnYyligQWSvsPyDpLubT
// SIG // 42YlETicaUPq0ySk/6Il6ggOKFic6QIDAQABo4IBVTCC
// SIG // AVEwEgYDVR0TAQH/BAgwBgEB/wIBADAfBgNVHSMEGDAW
// SIG // gBT5YLvU49U09rj1BoAlp3PbRmmonjB8BggrBgEFBQcB
// SIG // AQRwMG4wSgYIKwYBBQUHMAKGPmh0dHA6Ly93d3cuc3Ns
// SIG // LmNvbS9yZXBvc2l0b3J5L1NTTGNvbS1Sb290Q0EtRVYt
// SIG // UlNBLTQwOTYtUjIuY3J0MCAGCCsGAQUFBzABhhRodHRw
// SIG // Oi8vb2NzcHMuc3NsLmNvbTARBgNVHSAECjAIMAYGBFUd
// SIG // IAAwEwYDVR0lBAwwCgYIKwYBBQUHAwMwRQYDVR0fBD4w
// SIG // PDA6oDigNoY0aHR0cDovL2NybHMuc3NsLmNvbS9TU0xj
// SIG // b20tUm9vdENBLUVWLVJTQS00MDk2LVIyLmNybDAdBgNV
// SIG // HQ4EFgQUNr1J/zEs669qQP6ZwBbtuvxI3V8wDgYDVR0P
// SIG // AQH/BAQDAgGGMA0GCSqGSIb3DQEBCwUAA4ICAQByj/qB
// SIG // SIKR4mCDJVt7jy+UD4NYzogk+plCTi1ON4n4n7EernRA
// SIG // efney/f/LCUQUphAj1Q4/13RKqla5rcCu8h/7irT/3/M
// SIG // NjxVKUNdNkmWJl1w5/IrBWdHTJlYGQj2scZPYNL8OL4C
// SIG // rCXRiA2lLOHd031Xz2rDGWDSbapde0ToWluD28gbNgp+
// SIG // CvUKUjZ44pr7E1TMnMlHv2JONa8+4boPyZPu1SC3lrdQ
// SIG // dlI1ep2hOyZkNx/OvAN7xGGBUonMe/5aBRpHruQSyo5U
// SIG // 41qfsMGK8vlfRmi5r8fZPoTRKyUSOD27mgHq38xmqLbF
// SIG // H2qTR7DOBpKErUODaoY5XEziAkt4c65LKOak+GFpgMz/
// SIG // NOiwL2QCSQ2NLh9966GGBQ/tXnA05RgCAOtjvnUmbacc
// SIG // kFcHrpmljjfSp8NYbKX051IiNadbu27rSNuact6qWmJJ
// SIG // CZ6QKxIPyDrbr2hzndnjecqY+Wgd6uZYLqkYbM2ZOprN
// SIG // JnBE5maYnCUeGWrH2PPn/6Y1d/v1fbuMgsdvfVQyu+qZ
// SIG // CznoIFEVL4njKuHFIPN6eE49rxdiklSNJ4yQN9zjKehC
// SIG // k7b4OysLmVC45DQGmCPu6t+1VLuu2/Hq3XL5Re2x2kM7
// SIG // gPxvbN/ckW24pdTvdc1lTGQsWd8TLgIbS/oEk8C7Nx0f
// SIG // siDTTzOvFqEcwKqoiDGCAjkwggI1AgEBMIGPMHsxCzAJ
// SIG // BgNVBAYTAlVTMQ4wDAYDVQQIDAVUZXhhczEQMA4GA1UE
// SIG // BwwHSG91c3RvbjERMA8GA1UECgwIU1NMIENvcnAxNzA1
// SIG // BgNVBAMMLlNTTC5jb20gRVYgQ29kZSBTaWduaW5nIElu
// SIG // dGVybWVkaWF0ZSBDQSBSU0EgUjMCEFBpzjvWQk0fcGQD
// SIG // 4MrE244wDQYJYIZIAWUDBAIBBQCgfDAQBgorBgEEAYI3
// SIG // AgEMMQIwADAZBgkqhkiG9w0BCQMxDAYKKwYBBAGCNwIB
// SIG // BDAcBgorBgEEAYI3AgELMQ4wDAYKKwYBBAGCNwIBFTAv
// SIG // BgkqhkiG9w0BCQQxIgQgCdz9WwbzBu8RN3XSRPvjPPtf
// SIG // jkXa3pZTqiwMfCnz3u4wDQYJKoZIhvcNAQEBBQAEggEA
// SIG // ylGGu3X+r1tDD2qKsDow7aPQkBhS4/jlMtE202GXa1C7
// SIG // lI1UdQU1gHWOnXlYPMs35vrlpWjiwYZ5P4BfTvl8/ZWF
// SIG // gustVh8Ky6X1x+ymLJUqALvnr1Z5qpbx/hHyh3iZrfZs
// SIG // hcvZENg7AOgH4DBQBolh2W4TuI23+YKUPp7e8sNdEmJV
// SIG // YRrVVxlUsmE2391lBj2oDv60GS5CIyYbG5J1VL21/Boi
// SIG // +RzrOZwcjoNSFddkY2UIFDYxFK7MChxce9Zbcs2L6xKW
// SIG // 2CMpXfauJcJb0TZzxuIuuCdQFQrz8fRRjN44/G1zUPTu
// SIG // a2+FHvJr+X0i2HHFvUcKKKnj9FXzV9CmHg==
// SIG // End signature block
