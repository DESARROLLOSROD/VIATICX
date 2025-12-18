/**
 * JWT Payload Interface
 * Defines the structure of data stored in JWT tokens
 */
export interface JwtPayload {
  /**
   * User ID
   */
  sub: string;

  /**
   * User email
   */
  email: string;

  /**
   * User role
   */
  role: string;

  /**
   * Company ID
   */
  companyId: string;

  /**
   * Issued at timestamp
   */
  iat?: number;

  /**
   * Expiration timestamp
   */
  exp?: number;
}

/**
 * Refresh Token Payload Interface
 */
export interface RefreshTokenPayload {
  /**
   * User ID
   */
  sub: string;

  /**
   * Token ID for blacklisting
   */
  tokenId: string;

  /**
   * Issued at timestamp
   */
  iat?: number;

  /**
   * Expiration timestamp
   */
  exp?: number;
}
