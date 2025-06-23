/**
 * Logger utility that only outputs logs in development environment
 * Provides console methods that are safe for production builds
 */

const isDevelopment = __DEV__;

interface Logger {
  log: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  debug: (...args: unknown[]) => void;
}

/**
 * Development-aware logger
 * Only outputs to console when in development mode
 */
export const logger: Logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },

  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  error: (...args: unknown[]) => {
    if (isDevelopment) {
      console.error(...args);
    }
  },

  debug: (...args: unknown[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
};

/**
 * Convenience function for logging with context
 * @param context - The context/module name for the log
 * @param message - The message to log
 * @param data - Optional additional data to log
 */
export const logWithContext = (context: string, message: string, data?: unknown) => {
  if (isDevelopment) {
    if (data) {
      console.log(`[${context}] ${message}`, data);
    } else {
      console.log(`[${context}] ${message}`);
    }
  }
};

/**
 * Error logging with context
 * @param context - The context/module name for the error
 * @param error - The error to log
 * @param additionalInfo - Optional additional information
 */
export const logError = (context: string, error: Error | string, additionalInfo?: unknown) => {
  if (isDevelopment) {
    console.error(`[${context}] Error:`, error);
    if (additionalInfo) {
      console.error(`[${context}] Additional info:`, additionalInfo);
    }
  }
};
