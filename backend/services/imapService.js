// backend/services/imapService.js
const Imap = require('imap');
const { simpleParser } = require('mailparser');

function formatEmailAddress(address) {
    if (!address) return '';
    
    // If it's already a string, return it
    if (typeof address === 'string') return address;
    
    // If it's an array of address objects
    if (Array.isArray(address)) {
        return address.map(addr => {
            if (typeof addr === 'string') return addr;
            return addr.address || addr.text || '';
        }).join(', ');
    }
    
    // If it's a single address object
    if (typeof address === 'object') {
        if (address.text) return address.text;
        if (address.value) {
            return Array.isArray(address.value) 
                ? address.value.map(val => val.address).join(', ')
                : address.value.address || '';
        }
        return address.address || '';
    }
    
    return '';
}

const imapConfig = {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false }
};

async function fetchEmails() {
    return new Promise((resolve, reject) => {
        try {
            const imap = new Imap(imapConfig);
            const emails = [];

            imap.once('ready', () => {
                imap.openBox('INBOX', false, (err, box) => {
                    if (err) throw err;

                    // Fetch emails from the last 30 days
                    const date = new Date();
                    date.setDate(date.getDate() - 30);
                    
                    // Search for emails
                    imap.search(['ALL', ['SINCE', date]], (err, results) => {
                        if (err) throw err;

                        if (!results || !results.length) {
                            imap.end();
                            resolve([]);
                            return;
                        }

                        const fetch = imap.fetch(results, {
                            bodies: '',
                            markSeen: false
                        });

                        fetch.on('message', (msg) => {
                            msg.on('body', (stream) => {
                                simpleParser(stream, async (err, parsed) => {
                                    if (err) return console.error(err);

                                    try {
                                        const emailData = {
                                            id: parsed.messageId,
                                            from: parsed.from ? formatEmailAddress(parsed.from) : '',
                                            to: parsed.to ? formatEmailAddress(parsed.to) : '',
                                            subject: parsed.subject || '(No Subject)',
                                            body: parsed.text || '',
                                            html: parsed.html,
                                            date: parsed.date,
                                            isRead: !parsed.flags?.includes('\\Seen'),
                                            attachments: parsed.attachments || []
                                        };

                                        emails.push(emailData);
                                    } catch (error) {
                                        console.error('Error processing email:', error);
                                    }
                                });
                            });
                        });

                        fetch.once('error', (err) => {
                            console.error('Fetch error:', err);
                        });

                        fetch.once('end', () => {
                            imap.end();
                            // Sort emails by date, newest first
                            emails.sort((a, b) => b.date - a.date);
                            resolve(emails);
                        });
                    });
                });
            });

            imap.once('error', (err) => {
                console.error('IMAP connection error:', err);
                reject(err);
            });

            imap.once('end', () => {
                console.log('IMAP connection ended');
            });

            imap.connect();
        } catch (err) {
            console.error('Error in fetchEmails:', err);
            reject(err);
        }
    });
}

module.exports = { fetchEmails };