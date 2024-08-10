const moment = require('moment');

function daysBetweenDates(date1, date2) {
  return date2.diff(date1, 'days');
}

function getNextScheduleDate(date, paymentFrequency) {
  switch (paymentFrequency) {
    case 'MONTHLY':
      return date.clone().add(1, 'months');
    case 'QUARTERLY':
      return date.clone().add(3, 'months');
    case 'HALF_YEARLY':
      return date.clone().add(6, 'months');
    case 'YEARLY':
      return date.clone().add(1, 'years');
    default:
      throw new Error('Unsupported payment frequency');
  }
}

function frequencyInterest(interestRate, days) {
  return Math.pow(1 + interestRate, 1 / days) - 1;
}

function calculateCashflow(
  loanAmount,
  numFractions,
  annualInterestRate,
  loanPeriodYears,
  unitsBought,
  disbursedDate,
  firstPaymentDate,
  paymentFrequency
) {
  const fractionalUnitValue = loanAmount / numFractions;
  const totalInstallments = loanPeriodYears * 12;
  const principalPerInstallment = loanAmount / totalInstallments;
  const dailyInterestRate = frequencyInterest(annualInterestRate, 365);

  const investmentAmount = fractionalUnitValue * unitsBought;

  let dates = [];
  let amounts = [];

  let remainingPrincipal = investmentAmount;

  // Initial investment outflow
  dates.push(disbursedDate);
  amounts.push(-investmentAmount);

  let currentDate = firstPaymentDate;
  let prevDate = disbursedDate;

  while (remainingPrincipal > 0) {
    const daysBetween = daysBetweenDates(prevDate, currentDate);
    const interestPayment = dailyInterestRate * daysBetween * remainingPrincipal;
    let principalPayment = (principalPerInstallment / numFractions) * unitsBought;

    if (principalPayment > remainingPrincipal) {
      principalPayment = remainingPrincipal;
    }

    const totalPayment = principalPayment + interestPayment;

    console.log(
      `principal_payment: ${principalPayment.toFixed(
        2
      )}, interest_payment: ${interestPayment.toFixed(2)}, total_payment: ${totalPayment.toFixed(
        2
      )}, remaining_principal: ${remainingPrincipal.toFixed(2)}, prev_date: ${prevDate.format(
        'YYYY-MM-DD'
      )}, current_date: ${currentDate.format('YYYY-MM-DD')}`
    );

    dates.push(currentDate);
    amounts.push(totalPayment);

    remainingPrincipal -= principalPayment;
    prevDate = currentDate;
    currentDate = getNextScheduleDate(currentDate, paymentFrequency);
  }

  const xirrValue = XIRR(amounts, dates);

  return { dates, amounts, xirrValue };
}

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

// Example usage
const loanAmount = 10000000;
const numFractions = 20;
const annualInterestRate = 0.2;
const loanPeriodYears = 2;
const unitsBought = 3;
const disbursedDate = moment('2024-04-01', 'YYYY-MM-DD');
const firstPaymentDate = moment('2024-05-01', 'YYYY-MM-DD');
const paymentFrequency = 'MONTHLY';

console.log('Calculation details:');
const { dates, amounts, xirrValue } = calculateCashflow(
  loanAmount,
  numFractions,
  annualInterestRate,
  loanPeriodYears,
  unitsBought,
  disbursedDate,
  firstPaymentDate,
  paymentFrequency
);

console.log(`\nInvestment amount: ${Math.abs(amounts[0]).toFixed(2)}`);
for (let i = 1; i < dates.length; i++) {
  console.log(`Payment ${i} on ${dates[i].format('YYYY-MM-DD')}: ${amounts[i].toFixed(2)}`);
}

console.log(`\nXIRR: ${(xirrValue * 100).toFixed(2)}%`);
