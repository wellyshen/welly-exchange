import formatDigits from "../formatDigits";

describe("formatDigits", () => {
  it('should return empty string when the "val" parameter is invalid', () => {
    // @ts-ignore
    let result = formatDigits(null);
    expect(result).toBe("");

    // @ts-ignore
    result = formatDigits(undefined);
    expect(result).toBe("");

    // Make sure 0 is excluded
    result = formatDigits(0);
    expect(result).toBe("0");
  });

  it("should not do format if decimal <= 2", () => {
    let result = formatDigits("100.15");
    expect(result).toBe("100.15");

    result = formatDigits(100.15);
    expect(result).toBe(`${100.15}`);
  });

  it("should do format if decimal > 2", () => {
    let result = formatDigits("100.156");
    expect(result).toBe("100.16");

    result = formatDigits(100.156);
    expect(result).toBe(`${100.16}`);
  });

  it('should work correctly base on the "decimal" parameter', () => {
    let result = formatDigits("100.0005", 4);
    expect(result).toBe("100.0005");

    result = formatDigits("100.00005", 4);
    expect(result).toBe("100.0001");
  });
});
