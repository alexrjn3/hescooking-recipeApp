export class Fraction {
    constructor(numerator, denominator = 1) {
        this.numerator = numerator;
        this.denominator = denominator;
        this.simplify();
    }

    // Simplifies the fraction by dividing numerator and denominator by their GCD
    simplify() {
        const gcd = this._gcd(this.numerator, this.denominator);
        this.numerator /= gcd;
        this.denominator /= gcd;
    }

    // Helper method to calculate the Greatest Common Divisor (GCD)
    _gcd(a, b) {
        if (!b) return a;
        return this._gcd(b, a % b);
    }

    // Returns a string representation of the fraction
    toString() {
        if (this.denominator === 1) return `${this.numerator}`;
        return `${this.numerator}/${this.denominator}`;
    }
}
