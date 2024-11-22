const Imap = require('imap');
const { simpleParser } = require('mailparser');

function formatEmailAddress(address) {
    if (!address) return '';
    
    if (typeof address === 'string') return address;
    
    if (Array.isArray(address)) {
        return address.map(addr => {
            if (typeof addr === 'string') return addr;
            return addr.address || addr.text || '';
        }).join(', ');
    }
    
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
    tlsOptions: { rejectUnauthorized: false },
    authTimeout: 3000,
    keepalive: {
        interval: 60000, // 60 seconds
        idleInterval: 60000,
        forceNoop: true
    }
};

async function fetchEmails() {
    return new Promise((resolve, reject) => {
        try {
            const imap = new Imap(imapConfig);
            const emails = [];

            imap.once('ready', () => {
                imap.openBox('INBOX', false, async (err, box) => {
                    if (err) {
                        console.error('Error opening inbox:', err);
                        reject(err);
                        return;
                    }

                    const date = new Date();
                    date.setDate(date.getDate() - 30);

                    imap.search([['SINCE', date]], (err, results) => {
                        if (err) {
                            console.error('Search error:', err);
                            reject(err);
                            return;
                        }

                        console.log('Search results:', results);

                        if (!results || !results.length) {
                            console.log('No emails found');
                            imap.end();
                            resolve([]);
                            return;
                        }

                        console.log(`Found ${results.length} emails`);

                        const fetch = imap.fetch(results, {
                            bodies: '',
                            markSeen: false,
                            struct: true
                        });

                        const promises = results.map(seqno => {
                            return new Promise((resolve, reject) => {
                                const f = imap.fetch(seqno, { bodies: '' });
                                f.on('message', (msg) => {
                                    msg.on('body', (stream) => {
                                        simpleParser(stream, (err, parsed) => {
                                            if (err) {
                                                console.error(`Error parsing message #${seqno}:`, err);
                                                reject(err);
                                                return;
                                            }

                                            try {
                                                const emailData = {
                                                    id: parsed.messageId || `${Date.now()}-${seqno}`,
                                                    from: parsed.from ? formatEmailAddress(parsed.from) : '',
                                                    to: parsed.to ? formatEmailAddress(parsed.to) : '',
                                                    cc: parsed.cc ? formatEmailAddress(parsed.cc) : '',
                                                    subject: parsed.subject || '(No Subject)',
                                                    body: parsed.text || '',
                                                    html: parsed.html,
                                                    date: parsed.date,
                                                    isRead: parsed.flags ? !parsed.flags.includes('\\Seen') : true,
                                                    attachments: parsed.attachments || [],
                                                    seqno: seqno
                                                };

                                                emails.push(emailData);
                                                console.log(`Processed email #${emails.length} of ${results.length}`);
                                                resolve();
                                            } catch (error) {
                                                console.error(`Error processing email #${seqno}:`, error);
                                                reject(error);
                                            }
                                        });
                                    });
                                });

                                f.once('error', (err) => {
                                    console.error('Fetch error:', err);
                                    reject(err);
                                });
                            });
                        });

                        Promise.all(promises)
                            .then(() => {
                                emails.sort((a, b) => b.date - a.date);
                                imap.end();
                                resolve(emails);
                            })
                            .catch(err => {
                                console.error('Error processing emails:', err);
                                imap.end();
                                reject(err);
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
