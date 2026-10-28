import { APIError, type CollectionBeforeOperationHook } from 'payload'
import { clientIp, RATE_LIMIT_MESSAGE, rateLimit } from '../../lib/rateLimit'

// Account flows a password-guessing bot would hammer. Runs before Payload
// checks anything, for REST, GraphQL and the admin alike. Payload's own
// per-account lockout still applies after this.
const AUTH_OPERATIONS = new Set(['login', 'forgotPassword', 'resetPassword', 'unlock'])

export const rateLimitAuth: CollectionBeforeOperationHook = ({ args, operation, req }) => {
    if (!AUTH_OPERATIONS.has(operation)) return args
    const result = rateLimit('auth', clientIp(req.headers))
    if (!result.ok) throw new APIError(RATE_LIMIT_MESSAGE, 429)
    return args
}
