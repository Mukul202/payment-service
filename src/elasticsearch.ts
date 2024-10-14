import { Client } from "@elastic/elasticsearch";
import { ClusterHealthResponse } from "@elastic/elasticsearch/lib/api/types";
import { config } from "./config";
import { Logger } from "winston";
import { winstonLogger } from "@Mukul202/keychain-shared";

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'paymentElasticSearchServer', 'debug');

const elasticSearchClient = new Client({
    node: `${config.ELASTIC_SEARCH_URL}`,
    auth: {
        username: 'elastic',
        password: 'admin1234'
    }
});

export async function checkConnection(): Promise<void> {
    let isConnected = false;
    while (!isConnected) {
        try {
            const health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});
            log.info(`PaymentService ElasticSearch health status - ${health.status}`);
            isConnected = true;
        } catch (error) {
            log.error('Connection to Elasticsearch failed. Retrying...');
            log.log('error', 'PaymentService checkConnection() method', error);
        }
    }
}

export async function logToElasticsearch(logEntry: object): Promise<void> {
    try {
        await elasticSearchClient.index({
            index: `logs-${new Date().toISOString().split('T')[0]}`,
            body: logEntry
        });
        log.info('Log entry indexed successfully');
    } catch (error) {
        log.error('Error indexing log entry:', error);
    }
}

// Example usage
// logToElasticsearch({
//   "@timestamp": new Date().toISOString(),
//   message: "PaymentService checkConnection() method security_exception",
//   severity: "error",
//   service: "paymentElasticSearchServer"
// });
