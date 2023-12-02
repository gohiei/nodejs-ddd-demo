export class NumberInterval {
  private constructor(
    public readonly min: number,
    public readonly max: number,
  ) {}

  static default(): NumberInterval {
    return NumberInterval.build(0, 10);
  }

  static build(min: number, max: number): NumberInterval {
    return new NumberInterval(Number(min), Number(max));
  }

  isValid() {
    return (
      !Number.isNaN(this.min) && !Number.isNaN(this.max) && this.min < this.max
    );
  }
}
