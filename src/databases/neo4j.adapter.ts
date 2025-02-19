import neo4j from 'neo4j-driver';
import { Config, Logger } from '@cmmv/core';
import { VectorDatabaseAdapter } from './database.abstract';
import { DatasetEntry } from "../dataset.interface";

export class Neo4jAdapter extends VectorDatabaseAdapter {

    private driver;
    private session;
    private logger = new Logger('Neo4jAdapter');

    async connect() {
        const uri = Config.get('ai.vector.neo4j.url', 'bolt://localhost:7687');
        const user = Config.get('ai.vector.neo4j.user', 'neo4j');
        const password = Config.get('ai.vector.neo4j.password', 'password');

        this.driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
        this.session = this.driver.session();
        this.logger.verbose(`Connected to Neo4j at ${uri}`);
    }

    async saveVector(entry: DatasetEntry) {
        await this.session.run(
            'MERGE (e:Embedding {id: $id}) SET e.vector = $vector',
            { id: entry.id, vector: Array.from(entry.vector) }
        );

        this.logger.verbose(`Saved vector: ${entry.id}`);
    }

    async searchVector(queryVector: Float32Array, topK = 5): Promise<any[]> {
        const result = await this.session.run(
            'MATCH (e:Embedding) RETURN e.id, e.vector ORDER BY e.vector <-> $queryVector LIMIT $topK',
            { queryVector: Array.from(queryVector), topK }
        );

        return result.records.map((record) => ({
            filename: '',
            type: 'Unknown',
            value: record.get('e.id'),
            snippet: '',
            vector: new Float32Array(record.get('e.vector')),
        }));
    }

    async clear(): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
