import dotenv from "dotenv";

dotenv.config();

class Config {
    public NODE_ENV: string;
    public CLIENT_URL: string;
    public API_GATEWAY_URL: string;
    public ZERODEV_REMOTE_SIGNER_ADDRESS: string;
    public ZERODEV_API_KEY: string;
    public ZERODEV_ID: string;
    public ELASTIC_SEARCH_URL: string;

    constructor() {
        this.NODE_ENV = process.env.NODE_ENV || '';
        this.CLIENT_URL = process.env.CLIENT_URL || '';
        this.API_GATEWAY_URL = process.env.API_GATEWAY_URL || '';
        this.ZERODEV_REMOTE_SIGNER_ADDRESS = process.env.ZERODEV_REMOTE_SIGNER_ADDRESS || '';
        this.ZERODEV_API_KEY = process.env.ZERODEV_API_KEY || '';
        this.ZERODEV_ID = process.env.ZERODEV_ID || '';
        this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || '';
    }
}

export const config = new Config();
