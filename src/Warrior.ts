export class Warrior {
  private nm: string;
  private lvl: number;
  private rnk: string;
  private exp: number;
  private ach: string[];

  constructor(warrior: {
    nm: string;
    lvl?: number | undefined;
    rnk?: string | undefined;
    exp?: number | undefined;
    ach?: string[] | undefined;
  }) {
    this.nm = warrior.nm;
    this.lvl = warrior.lvl || 1;
    this.rnk = warrior.rnk || "Слабак";
    this.exp = warrior.exp || 100;
    this.ach = warrior.ach || [];
  }

  name() {
    return this.nm;
  }

  level() {
    return this.lvl;
  }

  rank() {
    return this.rnk;
  }

  achievements() {
    return this.ach;
  }

  experience() {
    return this.exp;
  }

  checklvl() {
    if (this.exp > 10000) this.exp = 10000;
    this.lvl = Math.floor(this.exp / 100);
    const ranks = [
      "Слабак",
      "Новичек",
      "Боец",
      "Воин",
      "Ветеран",
      "Мудрец",
      "Элита",
      "Завоеватель",
      "Чемпион",
      "Мастер",
      "Величайший",
    ];
    this.rnk = ranks[Math.floor(this.lvl / 10)];
  }

  training(training: [string, number, number]) {
    if (training[2] > this.lvl) return "Not strong enough";
    this.exp += training[1];
    this.checklvl();
    this.ach.push(training[0]);
    return training[0];
  }

  battle(enemyLevel: number) {
    if (enemyLevel < 1 || enemyLevel > 100) return "Invalid level";

    const levelDiff = enemyLevel - this.lvl;
    const rankDiff = Math.floor(enemyLevel / 10) - Math.floor(this.lvl / 10);

    if (rankDiff >= 1 && levelDiff >= 5) {
      return "You've been defeated";
    }

    if (levelDiff === 0) {
      this.exp += 10;
      this.checklvl();
      return "A good fight";
    } else if (levelDiff === -1) {
      this.exp += 5;
      this.checklvl();
      return "A good fight";
    } else if (levelDiff < -1) {
      return "Easy fight";
    } else {
      this.exp += 20 * levelDiff * levelDiff;
      this.checklvl();
      return "An intense fight";
    }
  }
}
