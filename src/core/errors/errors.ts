import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';

// Service Layer: business logic errors
export class EntityNotFoundError extends Error {}
export class EntityConflictError extends Error {}
export class ArgumentsError extends Error {}
export class UnauthorizedError extends Error {}

// Controller Layer: map to HTTP exception and rethrow
export const rethrowToHttp = (e: Error) => {
  switch (e.constructor) {
    case EntityNotFoundError:
      throw new NotFoundException(e.message);
    case EntityConflictError:
      throw new ConflictException(e.message);
    case ArgumentsError:
      throw new BadRequestException(e.message);
    default:
      throw e; // InternalServerErrorException
  }
};
