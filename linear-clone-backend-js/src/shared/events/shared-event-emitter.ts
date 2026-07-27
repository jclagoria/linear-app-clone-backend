import { InProcessEventEmitter } from '../../modules/gateway/adapters/out/in-process-event-emitter';

/**
 * Shared event emitter instance for cross-module communication.
 * Used by both work module controllers (via WorkToGatewayBridge) and gateway setup.
 */
export const sharedEventEmitter = new InProcessEventEmitter();
