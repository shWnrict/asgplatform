const Imap = require('imap');
const { simpleParser } = require('mailparser');

const imapConfig = {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false }
};

async function fetchTodaysEmails() {
    return new Promise((resolve, reject) => {
        const imap = new Imap(imapConfig);
        const emails = [];

        imap.once('ready', () => {
            imap.openBox('INBOX', false, (err, box) => {
                if (err) return reject(err);

                const date = new Date();
                date.setHours(0, 0, 0, 0); // Start of today

                imap.search([['SINCE', date]], (err, results) => {
                    if (err || !results.length) return resolve([]);

                    const fetch = imap.fetch(results, { bodies: '' });
                    fetch.on('message', (msg) => {
                        msg.on('body', (stream) => {
                            simpleParser(stream, (err, parsed) => {
                                if (err) return reject(err);

                                emails.push({
                                    from: parsed.from.text,
                                    subject: parsed.subject,
                                    date: parsed.date,
                                    body: parsed.text
                                });

                                if (emails.length === results.length) {
                                    imap.end();
                                    resolve(emails);
                                }
                            });
                        });
                    });
                });
            });
        });

        imap.once('error', (err) => reject(err));
        imap.connect();
    });
}

module.exports = { fetchTodaysEmails };
