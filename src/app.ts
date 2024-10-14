import express, { Application } from "express";
import { start } from "./server";
import { Logger } from "winston";
import { winstonLogger } from "@Mukul202/keychain-shared";
import { config } from "./config";

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'paymentApp', 'debug');

function initializeApp(): void {
    const app: Application = express();
    start(app);
    log.info('Payment Service initialized');
}

initializeApp();
