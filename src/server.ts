import http from "http";
import "express-async-errors";
import { Logger } from "winston";
import { IErrorResponse, winstonLogger } from "@Mukul202/keychain-shared";
import { config } from "./config";
import { Application, Request, Response, NextFunction, json, urlencoded } from "express";
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { checkConnection } from "./elasticsearch";
import { sessionKeyRoutes } from "./routes/sessionKey";

const SERVER_PORT = 3000;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'paymentServer', 'debug');

export function start(app: Application): void {
    securityMiddleware(app);
    standardMiddleware(app);
    routesMiddleware(app);
    // startElasticSearch();
    errorHandler(app);
    startServer(app);
}

function securityMiddleware(app: Application): void {
    app.set('trust proxy', 1);
    app.use(hpp());
    app.use(helmet());
    app.use(
        cors({
            origin: '*',
            // origin: config.API_GATEWAY_URL,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
        })
    );
}

function standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '200mb' }));
    app.use(urlencoded({ extended: true, limit: '200mb' }));
}

function routesMiddleware(app: Application): void {
    app.use('/api/session_key', sessionKeyRoutes);
}

function startElasticSearch(): void {
    checkConnection();
}

function errorHandler(app: Application): void {
    app.use((err: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
        log.error(`PaymentService error: ${err.message}`, err);
        res.status(500).json({
            error: "Internal Server Error",
            details: err.message
        });
        next();
    });
}

function startServer(app: Application): void {
    try {
        const httpServer: http.Server = new http.Server(app);
        log.info(`Authentication server has started with process id ${process.pid}`);
        httpServer.listen(SERVER_PORT, () => {
            log.info(`Payment Server running on port ${SERVER_PORT}`);
        });
    } catch (error) {
        log.error('PaymentService startServer() error:', error);
    }
}
