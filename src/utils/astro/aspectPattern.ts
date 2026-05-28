import { Aspect, AspectItem, PlanetItem } from './planets';

export enum PatternType {
  'GrandTrine' = 'GrandTrine',
  'Kite' = 'Kite',
  'TSquare' = 'TSquare',
  'GrandCross' = 'GrandCross',
  'MysticRectangle' = 'MysticRectangle',
  // 'Yod' = 'Yod',
}

export type ConjunctionGroup = {
  planets: PlanetItem['name'][];
};

type PatternSlot = PlanetItem['name'][];

export type Pattern = {
  /**
   * 格局类型
   */
  type: PatternType;

  /**
   * 格局顶点
   */
  slots: PatternSlot[];

  /**
   * 所有参与行星（拍平）
   */
  planets: PlanetItem['name'][];

  /**
   * 特殊结构信息（按需存在）
   */
  apex?: PatternSlot;

  base?: [PatternSlot, PatternSlot];

  spine?: [PatternSlot, PatternSlot];

  // sign?: ZodiacSign;

  // house?: number;
};

// 占星格局 v2 版本
export class AspectPatternEngine {
  private aspects: AspectItem[];
  private planetData: PlanetItem[];
  private conjunctionGroups: ConjunctionGroup[];
  private slotMap = new Map<PlanetItem['name'], PlanetItem['name'][]>();

  constructor(aspects: AspectItem[], planetData: PlanetItem[]) {
    this.aspects = aspects;
    this.planetData = planetData;
    const conjunctionGroups = this.buildConjunctionGroups();
    this.conjunctionGroups = conjunctionGroups;
    // console.log('conjunctionGroups', conjunctionGroups);

    this.buildSlots();
  }

  private buildSlots() {
    // 合相群
    for (const group of this.conjunctionGroups) {
      for (const p of group.planets) {
        this.slotMap.set(p, group.planets);
      }
    }

    // 未合相行星
    for (const asp of this.aspects) {
      for (const p of asp.between) {
        if (!this.slotMap.has(p)) {
          this.slotMap.set(p, [p]);
        }
      }
    }
  }

  /**
   * 构建合相群
   */
  private buildConjunctionGroups(): ConjunctionGroup[] {
    // adjacency graph
    const graph = new Map<PlanetItem['name'], Set<PlanetItem['name']>>();

    // 建图
    for (const asp of this.aspects) {
      if (asp.type !== Aspect.Conjunction) continue;

      const [a, b] = asp.between;

      if (!graph.has(a)) {
        graph.set(a, new Set());
      }

      if (!graph.has(b)) {
        graph.set(b, new Set());
      }

      graph.get(a)!.add(b);
      graph.get(b)!.add(a);
    }

    const visited = new Set<PlanetItem['name']>();

    const result: ConjunctionGroup[] = [];

    // DFS 找连通块
    const dfs = (node: PlanetItem['name'], group: Set<PlanetItem['name']>) => {
      visited.add(node);

      group.add(node);

      const neighbors = graph.get(node);

      if (!neighbors) return;

      for (const next of neighbors) {
        if (visited.has(next)) continue;

        dfs(next, group);
      }
    };

    for (const node of graph.keys()) {
      if (visited.has(node)) continue;

      const group = new Set<PlanetItem['name']>();

      dfs(node, group);

      result.push({
        planets: [...group],
      });
    }

    return result;
  }

  private getSlot(planet: PlanetItem['name']): PlanetItem['name'][] {
    return this.slotMap.get(planet)!;
  }

  // 获取所有顶级格局
  public detectAll() {
    let patterns: Pattern[] = [];

    const GrandTrine = this.detectGrandTrine();
    // console.log('GrandTrine', GrandTrine);
    const Kite = this.detectKite(GrandTrine);
    // console.log('Kite', Kite);
    // patterns = patterns.concat(Kite.length ? Kite : GrandTrine);
    patterns = patterns.concat(GrandTrine, Kite);

    const TSquare = this.detectTSquare();
    // console.log('TSquare', TSquare);
    const GrandCross = this.detectGrandCross(TSquare);
    // console.log('GrandCross', GrandCross);
    patterns = patterns.concat(GrandCross.length ? GrandCross : TSquare);

    patterns.push(...this.detectMysticRectangle());

    // console.log('patterns', patterns);

    return {
      patterns,
      conjunctionGroups: this.conjunctionGroups,
      stellium: this.detectStellium(),
    };
  }

  // 去重
  private deduplicate<T extends Pattern>(list: T[]): T[] {
    const seen = new Set<string>();

    return list.filter((item) => {
      // slot 内排序
      const normalizedSlots = item.slots.map((slot) => [...slot].sort().join('&')).sort();

      const key = `${item.type}:${normalizedSlots.join('|')}`;

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);

      return true;
    });
  }

  /**
   * 是否存在某种相位（基于真实行星）
   */
  private hasAspect(a: PlanetItem['name'], b: PlanetItem['name'], type: Aspect) {
    return this.aspects.some(
      (asp) =>
        asp.type === type &&
        ((asp.between[0] === a && asp.between[1] === b) ||
          (asp.between[0] === b && asp.between[1] === a))
    );
  }

  /**
   * 两个 slot 是否存在某种相位
   *
   * 只要任意两颗星成立即可
   */
  private slotHasAspect(slotA: PlanetItem['name'][], slotB: PlanetItem['name'][], type: Aspect) {
    for (const a of slotA) {
      for (const b of slotB) {
        if (this.hasAspect(a, b, type)) {
          return true;
        }
      }
    }

    return false;
  }

  private getAllSlots() {
    return [
      ...new Map(
        [...this.slotMap.values()].map((slot) => [[...slot].sort().join('&'), slot])
      ).values(),
    ];
  }

  // 大三角（Grand Trine）
  // 条件：3个120°（trine）构成闭环三角
  private detectGrandTrine(): Pattern[] {
    const trines = this.aspects.filter((a) => a.type === Aspect.Trine);

    const allSlots = this.getAllSlots();

    const results: Pattern[] = [];

    // 找三角闭环
    for (const trine of trines) {
      const [a, b] = trine.between;

      const soltA = this.getSlot(a);
      const soltB = this.getSlot(b);

      // 同 slot 跳过
      if (soltA === soltB) continue;

      for (const soltC of allSlots) {
        // apex 不能在 base 中
        if (soltC === soltA || soltC === soltB) {
          continue;
        }

        const trineCA = this.slotHasAspect(soltC, soltA, Aspect.Trine);

        const trineCB = this.slotHasAspect(soltC, soltB, Aspect.Trine);

        if (!trineCA || !trineCB) continue;

        const slots = [soltA, soltB, soltC];

        const planets = [...new Set(slots.flat())];

        results.push({
          type: PatternType.GrandTrine,

          slots,

          planets,
        });
      }
    }

    return this.deduplicate(results);
  }

  /**
   * 风筝（Kite）
   *
   * 条件：
   * Grand Trine
   * +
   * 一个外部点：
   * - opposition 其中一个点
   * - sextile 另外两个点
   */
  private detectKite(grandTrines: Pattern[]): Pattern[] {
    const results: Pattern[] = [];

    const allPlanets = [...new Set(this.aspects.flatMap((a) => a.between))];

    for (const gt of grandTrines) {
      const slots = gt.slots;

      for (const apex of slots) {
        const others = slots.filter((s) => s !== apex) as [
          PlanetItem['name'][],
          PlanetItem['name'][]
        ];

        for (const p of allPlanets) {
          // 已在结构中
          if (gt.planets.includes(p)) continue;

          const externalSlot = [p];

          const opposition = this.slotHasAspect(externalSlot, apex, Aspect.Opposition);

          const sextile1 = this.slotHasAspect(externalSlot, others[0], Aspect.Sextile);

          const sextile2 = this.slotHasAspect(externalSlot, others[1], Aspect.Sextile);

          if (opposition && sextile1 && sextile2) {
            const kiteSlots = [...slots, externalSlot];

            results.push({
              type: PatternType.Kite,

              slots: kiteSlots,

              planets: [...new Set(kiteSlots.flat())],

              apex,

              spine: [apex, externalSlot],
            });
          }
        }
      }
    }

    return this.deduplicate(results);
  }

  /**
   * T-Square
   *
   * 条件：
   * - opposition
   * - 两端同时 square 第三个点
   */
  private detectTSquare(): Pattern[] {
    const oppositions = this.aspects.filter((a) => a.type === Aspect.Opposition);

    const allSlots = this.getAllSlots();

    const results: Pattern[] = [];

    for (const opp of oppositions) {
      const [a, b] = opp.between;

      const baseA = this.getSlot(a);
      const baseB = this.getSlot(b);

      // 同 slot 跳过
      if (baseA === baseB) continue;

      for (const apex of allSlots) {
        // apex 不能在 base 中
        if (apex === baseA || apex === baseB) {
          continue;
        }

        const square1 = this.slotHasAspect(apex, baseA, Aspect.Square);

        const square2 = this.slotHasAspect(apex, baseB, Aspect.Square);

        if (square1 && square2) {
          const slots = [apex, baseA, baseB];

          results.push({
            type: PatternType.TSquare,

            slots,

            planets: [...new Set(slots.flat())],

            apex,

            base: [baseA, baseB],
          });
        }
      }
    }

    return this.deduplicate(results);
  }

  /**
   * Grand Cross
   *
   * 条件：
   * 两个 T-Square
   * 共享 opposition base
   * apex 互相 opposition
   */
  private detectGrandCross(tSquares: Pattern[]): Pattern[] {
    const results: Pattern[] = [];

    for (let i = 0; i < tSquares.length; i++) {
      for (let j = i + 1; j < tSquares.length; j++) {
        const t1 = tSquares[i];
        const t2 = tSquares[j];

        if (t1.type !== PatternType.TSquare || t2.type !== PatternType.TSquare) {
          continue;
        }

        const base1 = t1.base!;
        const base2 = t2.base!;

        // base 必须相同
        const sameBase =
          JSON.stringify([...base1].map((s) => [...s].sort().join('&')).sort()) ===
          JSON.stringify([...base2].map((s) => [...s].sort().join('&')).sort());

        if (!sameBase) continue;

        // apex opposition
        const apexOpposition = this.slotHasAspect(t1.apex!, t2.apex!, Aspect.Opposition);

        if (!apexOpposition) continue;

        const slots = [t1.apex!, t2.apex!, ...base1];

        results.push({
          type: PatternType.GrandCross,

          slots,

          planets: [...new Set(slots.flat())],
        });
      }
    }

    return this.deduplicate(results);
  }

  /**
   * Mystic Rectangle（神秘矩形）
   *
   * 条件：
   * - 2组 Opposition
   * - 2组 Trine
   * - 2组 Sextile
   *
   * 结构：
   *
   * A ----- trine ----- B
   * |                   |
   * sextile          sextile
   * |                   |
   * D ----- trine ----- C
   */
  private detectMysticRectangle(): Pattern[] {
    const oppositions = this.aspects.filter((a) => a.type === Aspect.Opposition);

    const results: Pattern[] = [];

    for (let i = 0; i < oppositions.length; i++) {
      for (let j = i + 1; j < oppositions.length; j++) {
        const opp1 = oppositions[i];
        const opp2 = oppositions[j];

        const slotA = this.getSlot(opp1.between[0]);

        const slotB = this.getSlot(opp1.between[1]);

        const slotC = this.getSlot(opp2.between[0]);

        const slotD = this.getSlot(opp2.between[1]);

        // 去除重复 slot
        const unique = new Set([
          [...slotA].sort().join('&'),
          [...slotB].sort().join('&'),
          [...slotC].sort().join('&'),
          [...slotD].sort().join('&'),
        ]);

        // 必须是四个独立结构点
        if (unique.size !== 4) continue;

        /**
         * 需要满足：
         *
         * A trine C
         * B trine D
         *
         * A sextile D
         * B sextile C
         *
         * （或镜像）
         */

        const layout1 =
          this.slotHasAspect(slotA, slotC, Aspect.Trine) &&
          this.slotHasAspect(slotB, slotD, Aspect.Trine) &&
          this.slotHasAspect(slotA, slotD, Aspect.Sextile) &&
          this.slotHasAspect(slotB, slotC, Aspect.Sextile);

        const layout2 =
          this.slotHasAspect(slotA, slotD, Aspect.Trine) &&
          this.slotHasAspect(slotB, slotC, Aspect.Trine) &&
          this.slotHasAspect(slotA, slotC, Aspect.Sextile) &&
          this.slotHasAspect(slotB, slotD, Aspect.Sextile);

        if (!(layout1 || layout2)) {
          continue;
        }

        const slots = [slotA, slotB, slotC, slotD];

        results.push({
          type: PatternType.MysticRectangle,

          slots,

          planets: [...new Set(slots.flat())],
        });
      }
    }

    return this.deduplicate(results);
  }
  // Stellium（星群）
  private detectStellium() {
    const res: { name: PlanetItem['sign']; data: PlanetItem[] }[] = [];
    const map = this.planetData.reduce((r, p) => {
      if (!r[p.sign]) {
        r[p.sign] = [p];
      } else {
        r[p.sign].push(p);
      }
      return r;
    }, {} as Record<PlanetItem['sign'], PlanetItem[]>);

    Object.keys(map).forEach((key) => {
      const k = key as PlanetItem['sign'];
      if (map[k].length > 3) {
        res.push({
          name: k,
          data: map[k],
        });
      }
    });

    return res;
  }
}
