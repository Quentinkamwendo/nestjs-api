export const config = () => ({
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  host: process.env.HOST,
  dbport: process.env.DB_PORT || 3306,
  mailhost: process.env.MAIL_HOST,
  mailport: process.env.MAIL_PORT,
  mailsecure: process.env.MAIL_SECURE,
  mailuser: process.env.MAIL_USER,
  mailpass: process.env.MAIL_PASS,
});
