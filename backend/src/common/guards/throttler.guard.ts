import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

/**
 * Custom Throttler Guard for rate limiting
 * Extends NestJS ThrottlerGuard with custom configuration
 */
@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  /**
   * Override to customize error messages
   */
  protected errorMessage = 'Demasiadas solicitudes. Por favor intenta de nuevo más tarde.';
}
