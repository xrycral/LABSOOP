class ShapeFactory {
  static classes = new Map();

  static register(id, ShapeClass) {
    ShapeFactory.classes.set(id, ShapeClass);
  }

  static has(id) {
    return ShapeFactory.classes.has(id);
  }

  static create(id) {
    const ShapeClass = ShapeFactory.classes.get(id);
    if (!ShapeClass) throw new Error('Невідомий тип фігури: ' + id);
    return new ShapeClass();
  }
}