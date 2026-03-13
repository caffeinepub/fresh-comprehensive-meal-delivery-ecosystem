import "./index-BfIGtKmp.js";
const DEFAULT_RESTAURANT_RATES = {
  baseFare: 45,
  perKmRate: 6,
  minFare: 45,
  freeKm: 3
};
const DEFAULT_DABBAWALA_RATES = {
  baseFare: 35,
  perKmRate: 6,
  minFare: 35,
  freeKm: 4
};
const STORAGE_KEY = "allFareRates";
function getStoredAllFareRates() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
  }
  return {
    restaurant: DEFAULT_RESTAURANT_RATES,
    dabbawala: DEFAULT_DABBAWALA_RATES
  };
}
function saveAllFareRates(rates) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rates));
}
function calculateFareForType(distanceKm, type, overrideRates) {
  const rates = getStoredAllFareRates().dabbawala;
  const extraKm = Math.max(0, distanceKm - rates.freeKm);
  const fare = rates.baseFare + extraKm * rates.perKmRate;
  return Math.max(fare, rates.minFare);
}
function calculateDabbawalaFare(distanceKm, rates) {
  return calculateFareForType(distanceKm);
}
export {
  calculateDabbawalaFare as c,
  getStoredAllFareRates as g,
  saveAllFareRates as s
};
