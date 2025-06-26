import { z } from 'zod';

/**
 * Adapter to make Zod schemas work with NestJS ConfigModule
 * NestJS ConfigModule expects a validate function or Joi schema
 */
export function createZodValidation(schema: z.ZodSchema) {
  return (config: Record<string, unknown>) => {
    try {
      return schema.parse(config);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors
          .map((err) => `${err.path.join('.')}: ${err.message}`)
          .join(', ');
        throw new Error(`Configuration validation failed: ${formattedErrors}`);
      }
      throw error;
    }
  };
}
