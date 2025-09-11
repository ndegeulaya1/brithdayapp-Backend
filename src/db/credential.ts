import 'dotenv/config';


type DbCredentials = {
  accountId: string;
  databaseId: string;
  token: string;
};



export const dbCredentials: DbCredentials = {
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID ?? '',
  databaseId: process.env.CLOUDFLARE_DATABASE_ID ?? '',
  token: process.env.CLOUDFLARE_D1_TOKEN ?? '',
};