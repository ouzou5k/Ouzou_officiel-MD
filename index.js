const { default: makeWASocket, useSingleFileAuthState, DisconnectReason } = require('@adiwajshing/baileys');
const { session } = useSingleFileAuthState('./session.json');
const { OWNER_NUMBER, BOT_NAME } = require('./env');

// Objet pour suivre les utilisateurs qui ont utilisé la commande vue unique
const usedOnce = {};

async function startBot() {
    const sock = makeWASocket({
        auth: session,
        printQRInTerminal: true
    });

    sock.ev.on('messages.upsert', async (msg) => {
        const message = msg.messages[0];
        if (!message.message) return;

        const from = message.key.remoteJid;
        const sender = message.key.participant || from;
        const text = message.message.conversation || message.message.extendedTextMessage?.text;

        if (!text) return;

        console.log(`Message reçu de ${from}: ${text}`);

        switch(text.toLowerCase()) {
            case '.anime':
                await sock.sendMessage(from, { text: "Voici ton anime du jour : Naruto 🌸" });
                break;

            case '.profil':
                await sock.sendMessage(from, { text: "Profil de l'utilisateur : Ouzou 🤖\nStatut : En ligne" });
                break;

            case '.status':
                await sock.sendMessage(from, { text: "Le bot est opérationnel ✅" });
                break;

            case '.love':
                await sock.sendMessage(from, { text: "💖 Envoie d'amour et de good vibes !" });
                break;

            case '.time':
                const time = new Date().toLocaleString();
                await sock.sendMessage(from, { text: `⏰ Heure actuelle : ${time}` });
                break;

            case '.meme':
                await sock.sendMessage(from, { text: "😂 Meme du jour : https://i.imgflip.com/123abc.jpg" });
                break;

            case '.hack':
                await sock.sendMessage(from, { text: "🔒 Hack en cours... juste pour rire 😜" });
                break;

            case '.quiz':
                await sock.sendMessage(from, { text: "🎲 Quiz : Quel est le meilleur anime ? Réponds avec ton choix !" });
                break;

            case '.admin':
                await sock.sendMessage(from, { text: "⚡ Mode admin activé 🔐" });
                break;

            case '.help':
                await sock.sendMessage(from, { text: "📜 Commandes disponibles :\n.anime\n.profil\n.status\n.love\n.time\n.meme\n.hack\n.quiz\n.admin\n.game\n.joke\n.weather\n.once" });
                break;

            case '.game':
                await sock.sendMessage(from, { text: "🎮 Jeu du jour : Devine le nombre entre 1 et 10 !" });
                break;

            case '.joke':
                await sock.sendMessage(from, { text: "😆 Blague : Pourquoi l’ordinateur est allé chez le médecin ? Parce qu’il avait un virus !" });
                break;

            case '.weather':
                await sock.sendMessage(from, { text: "☀️ Météo : Aujourd’hui il fait beau ! (exemple)" });
                break;

            case '.once':
                if (usedOnce[sender]) {
                    await sock.sendMessage(from, { text: "❌ Tu as déjà utilisé cette commande une fois !" });
                } else {
                    usedOnce[sender] = true;
                    await sock.sendMessage(from, { text: "✅ Félicitations ! Tu as utilisé la commande vue unique 🎉" });
                }
                break;

            default:
                await sock.sendMessage(from, { text: "❌ Commande inconnue. Tape .help pour voir toutes les commandes." });
                break;
        }
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const reason = lastDisconnect.error?.output?.statusCode;
            console.log('Déconnexion, raison:', reason);
            startBot(); // Redémarrage automatique
        } else if (connection === 'open') {
            console.log(`${BOT_NAME} est connecté ✅`);
        }
    });
}

startBot();
