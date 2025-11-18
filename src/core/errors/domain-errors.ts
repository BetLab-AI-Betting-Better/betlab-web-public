export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class ResourceNotFoundError extends DomainError {
  constructor(resource: string, identifier?: string | number) {
    super(
      identifier
        ? `${resource} with identifier "${identifier}" was not found`
        : `${resource} was not found`
    );
  }
}

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super("Email ou mot de passe incorrect.");
  }
}

export class FavoriteAlreadyExistsError extends DomainError {
  constructor() {
    super("Ce match a déjà été ajouté aux favoris.");
  }
}
