const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

class AuthService {
  // Generate 2FA Secret
  static async generate2FASecret(userEmail) {
    const secret = speakeasy.generateSecret({
      name: `Clarix (${userEmail})`,
      issuer: 'Clarix',
      length: 32
    });

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    return {
      secret: secret.base32,
      qrCode: qrCode,
      otpauthUrl: secret.otpauth_url
    };
  }

  // Verify 2FA Token
  static verify2FAToken(secret, token) {
    return speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: 2 // Allow 30 seconds before/after
    });
  }

  // Generate backup codes
  static generateBackupCodes(count = 10) {
    const codes = [];
    for (let i = 0; i < count; i++) {
      codes.push(
        Math.random().toString(36).substring(2, 10).toUpperCase()
      );
    }
    return codes;
  }

  // Verify backup code
  static verifyBackupCode(backupCodes, providedCode) {
    return backupCodes.includes(providedCode.toUpperCase());
  }

  // Hash password
  static async hashPassword(password) {
    const bcrypt = require('bcryptjs');
    return await bcrypt.hash(password, 10);
  }

  // Compare password
  static async comparePassword(password, hash) {
    const bcrypt = require('bcryptjs');
    return await bcrypt.compare(password, hash);
  }

  // Generate JWT Token
  static generateToken(userId, email) {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { userId, email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    return token;
  }

  // Verify JWT Token
  static verifyToken(token) {
    const jwt = require('jsonwebtoken');
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      return null;
    }
  }
}

module.exports = AuthService;
