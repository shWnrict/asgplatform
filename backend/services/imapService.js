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

async function fetchEmails(boxName) {
    return new Promise((resolve, reject) => {
        const imap = new Imap(imapConfig);
        const emails = [];

        imap.once('ready', () => {
            imap.openBox(boxName, false, (err, box) => {
                if (err) return reject(err);

                const date = new Date();
                date.setHours(0, 0, 0, 0); // Start of today

                imap.search([['SINCE', date]], (err, results) => {
                  if (err || !results.length) return resolve([]);
              
                  const fetch = imap.fetch(results, { bodies: '', struct: true });
                  fetch.on('message', (msg, seqno) => {
                      msg.on('body', (stream) => {
                          simpleParser(stream, (err, parsed) => {
                              if (err) return reject(err);
              
                              emails.push({
                                  from: parsed.from.text,
                                  to: parsed.to ? parsed.to.text : '',
                                  subject: parsed.subject,
                                  date: parsed.date,
                                  body: parsed.text,
                                  html: parsed.html,
                                  attachments: parsed.attachments.map((att) => ({
                                      filename: att.filename,
                                      size: att.size,
                                      downloadUrl: `http://localhost:5000/api/email/attachments/${seqno}/${att.filename}` // Include download link
                                  })),
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

async function fetchTodaysEmails() {
    return fetchEmails('INBOX');
}

async function fetchTodaysSentEmails() {
    return fetchEmails('[Gmail]/Sent Mail');
}

async function fetchAttachment(uid, attachmentName, boxName = 'INBOX') {
  return new Promise((resolve, reject) => {
      const imap = new Imap(imapConfig);

      imap.once('ready', () => {
          imap.openBox(boxName, false, (err) => {
              if (err) return reject(err);

              const fetch = imap.fetch(uid, { bodies: '', struct: true });
              fetch.on('message', (msg) => {
                  msg.on('body', (stream) => {
                      simpleParser(stream, (err, parsed) => {
                          if (err) return reject(err);

                          const attachment = parsed.attachments.find(
                              (att) => att.filename === attachmentName
                          );
                          if (!attachment) return reject(new Error('Attachment not found'));

                          resolve({
                              filename: attachment.filename,
                              content: attachment.content,
                              contentType: attachment.contentType,
                          });
                          imap.end();
                      });
                  });
              });
          });
      });

      imap.once('error', (err) => reject(err));
      imap.connect();
  });
}

module.exports = { fetchTodaysEmails, fetchTodaysSentEmails, fetchAttachment };
