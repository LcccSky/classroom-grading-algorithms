# Classroom Grading Algorithms (`classroom-grading-algorithms`)

Zero-dependency, mathematically exact algorithms for K–12 and university assessment workflows—powering the free browser-local tools at **[GradingPad.com](https://gradingpad.com/)**.

Live interactive documentation & benchmarks: **[https://lcccsky.github.io/classroom-grading-algorithms/](https://lcccsky.github.io/classroom-grading-algorithms/)**

---

## Why Classroom Grading Math Frequently Goes Wrong

1. **The "Drop Lowest Quiz" Percentage Paradox (`0-1` Fractional Programming)**
   Suppose a student earns `7/10 (70%)`, `76/100 (76%)`, `18/20 (90%)`, `85/100 (85%)`, and `9/10 (90%)`.
   - A naive gradebook drops `7/10` because `70%` is the lowest percentage, leaving `188 / 230 = 81.7% (B-)`.
   - Dropping the high-weight `76/100` exam instead leaves `119 / 140 = 85.0% (B)` — a **+3.3% full letter-tier gain**!
   - `solveOptimalDropLowest()` uses **Dinkelbach's `0-1` Fractional Programming iteration** to find the globally optimal subset in `< 0.1 ms`. Try it live in the **[Test Grade Calculator](https://gradingpad.com/test-grade-calculator)**.

2. **IEEE-754 Floating-Point Boundary Errors on Exact Cutoffs**
   In JavaScript, `((27 - 2.7) / 27) * 100` evaluates to `89.99999999999999`, causing naive `score >= 90` checks to misclassify an exact `90.0%` (`24.3 / 27`) as a `B+` instead of an `A-`. `roundHalfUp()` eliminates binary representation drift across **[Grading Calculator](https://gradingpad.com/)** and **[Easy Grader](https://gradingpad.com/easy-grader)**.

3. **Outlier Distortion on Curved Exams (`0%` No-Shows & Tukey `1.5 × IQR`)**
   A single `0%` absent placeholder drags down class mean and inflates standard deviation on Bell and Z-Score curves. `trimExamOutliers()` filters unsubmitted zeros and Tukey lower-fence outliers before computing curve parameters in the **[Grading Curve Calculator](https://gradingpad.com/grading-curve-calculator)**.

4. **4-Point Analytic Rubric Compression (`3 / 4 = 75% C`)**
   On a raw proportional 4-level rubric, a student who meets every standard (`3 · Proficient` across all criteria) receives `75.0% (C)`. `RUBRIC_4_LEVEL_SCALES.standardsFair` maps `4 → 100% (A)`, `3 → 85% (B)`, `2 → 72% (C-)`, and `1 → 60% (D-)` in the **[Rubric Grader](https://gradingpad.com/rubric-grader)**.

---

## Live Classroom Tools Built on This Engine

- **[Grading Calculator](https://gradingpad.com/)** — 1–500 question quiz scorer with `0.5` half-point steps & speed stack.
- **[Easy Grader (EZ Slide Chart)](https://gradingpad.com/easy-grader)** — Digital replacement for cardboard EZ charts (`15Q`, `20Q`, `25Q`, `30Q`, `40Q`, `50Q`).
- **[Final Grade Calculator](https://gradingpad.com/final-grade-calculator)** — Syllabus-weighted exam target solver supporting `89.5% → 90%` rounding rules.
- **[Grading Curve Calculator](https://gradingpad.com/grading-curve-calculator)** — Compare Square-Root (`10√x`), True Z-Score (`μ, σ`), 2-Point Anchor, Linear, and Flat boosts.
- **[Rubric Grader](https://gradingpad.com/rubric-grader)** — 4-level analytic rubric matrix with Standards-Fair `85% B` conversion.
- **[Grading Scale Chart](https://gradingpad.com/grading-scale-chart)** — US 10-point vs. strict 7-point & 4.0/5.0 AP GPA reference tables.
- **[Random Group Generator](https://gradingpad.com/random-group-generator)** — CSPRNG unbiased shuffling + `DSATUR` keep-apart conflict graph coloring.

## License

MIT © GradingPad Curriculum & Math Team
