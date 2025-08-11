export class UtilsClass {
  static cleanUpUndefinedProperties<k>(o: k): k {
    return Object.fromEntries(
      Object.entries(o).filter(([_, v]) => v !== undefined),
    ) as k;
  }
}
