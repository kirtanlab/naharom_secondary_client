const moment = require('moment');
const dates = [
  moment('2024-04-01', 'YYYY-MM-DD'),
  moment('2024-05-01', 'YYYY-MM-DD'),
  moment('2024-06-01', 'YYYY-MM-DD'),
  moment('2024-07-01', 'YYYY-MM-DD'),
  moment('2024-08-01', 'YYYY-MM-DD'),
  moment('2024-09-01', 'YYYY-MM-DD'),
  moment('2024-10-01', 'YYYY-MM-DD'),
  moment('2024-11-01', 'YYYY-MM-DD'),
  moment('2024-12-01', 'YYYY-MM-DD'),
  moment('2025-01-01', 'YYYY-MM-DD'),
  moment('2025-02-01', 'YYYY-MM-DD'),
  moment('2025-03-01', 'YYYY-MM-DD'),
  moment('2025-04-01', 'YYYY-MM-DD'),
  moment('2025-05-01', 'YYYY-MM-DD'),
  moment('2025-06-01', 'YYYY-MM-DD'),
  moment('2025-07-01', 'YYYY-MM-DD'),
  moment('2025-08-01', 'YYYY-MM-DD'),
  moment('2025-09-01', 'YYYY-MM-DD'),
  moment('2025-10-01', 'YYYY-MM-DD'),
  moment('2025-11-01', 'YYYY-MM-DD'),
  moment('2025-12-01', 'YYYY-MM-DD'),
  moment('2026-01-01', 'YYYY-MM-DD'),
  moment('2026-02-01', 'YYYY-MM-DD'),
  moment('2026-03-01', 'YYYY-MM-DD'),
  moment('2026-04-01', 'YYYY-MM-DD'),
];
const money = [
  -500000.0, 28327.87, 28255.01, 27703.33, 27609.65, 27286.96, 26766.51, 26641.6, 26141.96,
  25996.24, 25673.56, 24913.69, 25028.19, 24580.6, 24382.83, 23956.06, 23737.47, 23414.79, 23019.24,
  22769.42, 22394.7, 22124.06, 21801.38, 21416.24, 21156.01,
];

// Calculate XIRR

function XIRR(values, dates, guess) {
  // Credits: algorithm inspired by Apache OpenOffice

  // Calculates the resulting amount
  var irrResult = function (values, dates, rate) {
    var r = rate + 1;
    var result = values[0];
    for (var i = 1; i < values.length; i++) {
      result += values[i] / Math.pow(r, moment(dates[i]).diff(moment(dates[0]), 'days') / 365);
    }
    return result;
  };

  // Calculates the first derivation
  var irrResultDeriv = function (values, dates, rate) {
    var r = rate + 1;
    var result = 0;
    for (var i = 1; i < values.length; i++) {
      var frac = moment(dates[i]).diff(moment(dates[0]), 'days') / 365;
      result -= (frac * values[i]) / Math.pow(r, frac + 1);
    }
    return result;
  };

  // Check that values contains at least one positive value and one negative value
  var positive = false;
  var negative = false;
  for (var i = 0; i < values.length; i++) {
    if (values[i] > 0) positive = true;
    if (values[i] < 0) negative = true;
  }

  // Return error if values does not contain at least one positive value and one negative value
  if (!positive || !negative) return '#NUM!';

  // Initialize guess and resultRate
  var guess = typeof guess === 'undefined' ? 0.1 : guess;
  var resultRate = guess;

  // Set maximum epsilon for end of iteration
  var epsMax = 1e-10;

  // Set maximum number of iterations
  var iterMax = 50;

  // Implement Newton's method
  var newRate, epsRate, resultValue;
  var iteration = 0;
  var contLoop = true;
  do {
    resultValue = irrResult(values, dates, resultRate);
    newRate = resultRate - resultValue / irrResultDeriv(values, dates, resultRate);
    epsRate = Math.abs(newRate - resultRate);
    resultRate = newRate;
    contLoop = epsRate > epsMax && Math.abs(resultValue) > epsMax;
  } while (contLoop && ++iteration < iterMax);

  if (contLoop) return '#NUM!';

  // Return internal rate of return
  return resultRate;
}
let j = XIRR(money, dates) * 100;
console.log(j);
