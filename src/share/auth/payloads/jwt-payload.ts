import { Role } from 'src/api/user/role.enum';

export interface JwtPayload {
  email: string;
  role: Role;
  name: string;
}
