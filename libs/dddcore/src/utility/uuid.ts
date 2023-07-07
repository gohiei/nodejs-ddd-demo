import * as uuid from 'uuid';

export class UUID {
  private id: string;

  private constructor(id) {
    this.id = id;
  }

  static new(): UUID {
    return new UUID(uuid.v4());
  }

  static build(id: string): UUID {
    const isValid = uuid.validate(id);

    if (!isValid) {
      throw new Error(`Invalid UUID: ${id}`);
    }

    return new UUID(id);
  }

  toString(): string {
    return this.id;
  }
}
