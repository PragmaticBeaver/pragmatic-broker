import { v4 as uuidv4 } from "uuid";

export class PragmaticBroker {
    private subscriptions: {
        [eventType: string]: any;
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
        for (const eventType in this.subscriptions) {
            if (this.subscriptions[eventType][id]) {
                delete this.subscriptions[eventType][id];
                const isEmpty =
                    Object.keys(this.subscriptions[eventType]).length === 0;
                if (isEmpty) {
                    delete this.subscriptions[eventType];
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
