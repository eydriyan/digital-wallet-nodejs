import { config } from 'dotenv';

// Load environment variables from a .env file into `process.env`
config();

// Define the interface for your configuration
interface Config {
  port: number | string;
  mongoURI?: string;
  jwtSecret?: string;
  stripeSecretKey?: string;
}

// Create the configuration object
const configuration: Config = {
  port: process.env.PORT || 3000,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
};

// Export the configuration object
export default configuration;
