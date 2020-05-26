import { v4 as uuidv4 } from "uuid";

export class PragmaticBroker {
    private subscriptions: {
        [topic: string]: any;
    };

    constructor() {
        this.subscriptions = {};
    }

    public subscribe(topic: string, cb: (...args: any) => void): string {
        const id = uuidv4();
        if (!this.subscriptions[topic]) {
            this.subscriptions[topic] = {};
        }
        this.subscriptions[topic][id] = cb;
        return id;
    }

    public unsubscribe(id: string): void {
        for (const topic in this.subscriptions) {
            if (this.subscriptions[topic][id]) {
                delete this.subscriptions[topic][id];
                const isEmpty =
                    Object.keys(this.subscriptions[topic]).length === 0;
                if (isEmpty) {
                    delete this.subscriptions[topic];
                }
            }
        }
    }

    public async publish(topic: string, ...args: any): Promise<void> {
        if (!this.subscriptions[topic]) {
            return;
        }
        const ids = Object.keys(this.subscriptions[topic]);
        for (const id of ids) {
            await this.subscriptions[topic][id](...args);
        }
    }
}
