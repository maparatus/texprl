export default class Vector {
  constructor (x, y) {
    this.x = x;
    this.y = y;
  }

  len () {
    return Math.sqrt(this.lenSq());
  }

  lenSq () {
    return this.x * this.x + this.y * this.y;
  }

  equals (b) {
    return (
      this.x === b.x &&
      this.y === b.y
    );
  }

  norm () {
    const l = this.len();
    return new Vector(
      this.x / l,
      this.y / l,
    );
  }

  add (b) {
    return new Vector(
      this.x + b.x,
      this.y + b.y,
    );
  }

  substract (b) {
    return new Vector(
      this.x - b.x,
      this.y - b.y,
    );
  }

  divide (n) {
    return new Vector(
      this.x / n,
      this.y / n,
    );
  }

  multiply (n) {
    return new Vector(
      this.x * n,
      this.y * n,
    );
  }

  toJSON () {
    return [this.x, this.y];
  }
}
