import { Injectable, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt';
import { hashSync, compare } from "bcrypt";

@Injectable()
export class AuthService {
  
    private readonly adminUsername: string
    private readonly adminPasswordHash: string

    constructor(
        private jwtService: JwtService
    ) {
        const adminPassword = process.env.ADMIN_PASSWORD
        if (!adminPassword) {
        throw new Error('ADMIN_PASSWORD is missing in .env file.')
        }

        const adminUsername = process.env.ADMIN_USERNAME;
        if (!adminUsername) {
            throw new Error('ADMIN_USERNAME is missing in .env file.')
        }
        // Hacher le mot de passe récupéré du fichier .env
        this.adminPasswordHash = hashSync(adminPassword, 10);
        this.adminUsername = adminUsername
    }

    async validateUser(username: string, password: string): Promise<boolean> {
        if (username === this.adminUsername && await compare(password, this.adminPasswordHash)) {
        return true
        }
        return false
    }

    async login(username: string) {
        const payload = { username }
        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}
