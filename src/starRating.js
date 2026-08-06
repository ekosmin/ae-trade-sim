const PULL_RATES = [
    { rating: "3", weight: 8 },
    { rating: "4", weight: 8 },
    { rating: "5", weight: 8 },
    { rating: "platinum", weight: 1 },
  ]; // total weight 25
  
  const TRADE_RATES = [
    { rating: "1", weight: 8 },
    { rating: "2", weight: 8 },
    { rating: "3", weight: 8 },
    { rating: "4", weight: 8 },
    { rating: "5", weight: 8 },
    { rating: "platinum", weight: 1 },
  ]; // total weight 41
  
  function rollFromTable(table) {
    const totalWeight = table.reduce((sum, entry) => sum + entry.weight, 0);
    let roll = Math.random() * totalWeight;
    for (const entry of table) {
      if (roll < entry.weight) return entry.rating;
      roll -= entry.weight;
    }
    return table[table.length - 1].rating; // fallback, shouldn't hit due to floating point
  }
  
  export function rollStarRating(method) {
    return method === "pulled" ? rollFromTable(PULL_RATES) : rollFromTable(TRADE_RATES);
  }