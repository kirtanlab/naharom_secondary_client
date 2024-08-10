import moment from 'moment';

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
  return (1 + interestRate) ** (1 / days) - 1;
}

// function calculateCashflow(
//   loanAmount,
//   numFractions,
//   annualInterestRate,
//   loanPeriodYears,
//   unitsBought,
//   disbursedDate,
//   firstPaymentDate,
//   paymentFrequency
// ) {
//   const fractionalUnitValue = loanAmount / numFractions;
//   const totalInstallments = loanPeriodYears * 12;
//   const principalPerInstallment = loanAmount / totalInstallments;
//   const dailyInterestRate = frequencyInterest(annualInterestRate, 365);

//   const investmentAmount = fractionalUnitValue * unitsBought;

//   const dates = [];
//   const amounts = [];

//   let remainingPrincipal = investmentAmount;

//   // Initial investment outflow
//   dates.push(disbursedDate);
//   amounts.push(-investmentAmount);

//   let currentDate = firstPaymentDate;
//   let prevDate = disbursedDate;

//   while (remainingPrincipal > 0) {
//     const daysBetween = daysBetweenDates(prevDate, currentDate);
//     const interestPayment = dailyInterestRate * daysBetween * remainingPrincipal;
//     let principalPayment = (principalPerInstallment / numFractions) * unitsBought;

//     if (principalPayment > remainingPrincipal) {
//       principalPayment = remainingPrincipal;
//     }

//     const totalPayment = principalPayment + interestPayment;

//     console.log(
//       `principal_payment: ${principalPayment.toFixed(
//         2
//       )}, interest_payment: ${interestPayment.toFixed(2)}, total_payment: ${totalPayment.toFixed(
//         2
//       )}, remaining_principal: ${remainingPrincipal.toFixed(2)}, prev_date: ${prevDate.format(
//         'YYYY-MM-DD'
//       )}, current_date: ${currentDate.format('YYYY-MM-DD')}`
//     );

//     dates.push(currentDate);
//     amounts.push(totalPayment);

//     remainingPrincipal -= principalPayment;
//     prevDate = currentDate;
//     currentDate = getNextScheduleDate(currentDate, paymentFrequency);
//   }

//   const xirrValue = XIRR(amounts, dates);

//   return { dates, amounts, xirrValue };
// }

function XIRR(cashflows, dates) {
  // Credits: algorithm inspired by Apache OpenOffice

  // Calculates the resulting amount
  const irrResult = function (cf, dt, rate) {
    const r = rate + 1;
    let result = cf[0];
    for (let i = 1; i < cf.length; i += 1) {
      result += cf[i] / r ** (moment(dt[i]).diff(moment(dt[0]), 'days') / 365);
    }
    return result;
  };

  // Calculates the first derivation
  const irrResultDeriv = function (cf, dt, rate) {
    const r = rate + 1;
    let result = 0;
    for (let i = 1; i < cf.length; i += 1) {
      const frac = moment(dt[i]).diff(moment(dt[0]), 'days') / 365;
      result -= (frac * cf[i]) / r ** (frac + 1);
    }
    return result;
  };

  // Check that cashflows contains at least one positive value and one negative value
  let positive = false;
  let negative = false;
  for (let i = 0; i < cashflows.length; i += 1) {
    if (cashflows[i] > 0) positive = true;
    if (cashflows[i] < 0) negative = true;
  }

  // Return error if cashflows does not contain at least one positive value and one negative value
  if (!positive || !negative) return '#NUM!';

  // Initialize guess and resultRate
  const guess = 0.1;
  let resultRate = guess;

  // Set maximum epsilon for end of iteration
  const epsMax = 1e-10;

  // Set maximum number of iterations
  const iterMax = 50;

  // Implement Newton's method
  let newRate;
  let epsRate;
  let resultValue;
  let iteration = 0;
  let contLoop = true;
  do {
    resultValue = irrResult(cashflows, dates, resultRate);
    newRate = resultRate - resultValue / irrResultDeriv(cashflows, dates, resultRate);
    epsRate = Math.abs(newRate - resultRate);
    resultRate = newRate;
    contLoop = epsRate > epsMax && Math.abs(resultValue) > epsMax;
    iteration += 1;
  } while (contLoop && iteration < iterMax);

  if (contLoop) return '#NUM!';

  // Return internal rate of return
  return resultRate;
}

export function calculateInvestmentDetails(
  loanAmount,
  numFractions,
  annualInterestRate,
  loanPeriodYears,
  unitsBought,
  disbursedDate,
  firstPaymentDate,
  paymentFrequency
) {
  console.log(
    'calculatingInvestmentDetails: ',
    loanAmount,
    numFractions,
    annualInterestRate,
    loanPeriodYears,
    unitsBought,
    disbursedDate,
    firstPaymentDate,
    paymentFrequency
  );
  const fractionalUnitValue = loanAmount / numFractions;
  const totalInstallments = loanPeriodYears * 12;
  const principalPerInstallment = loanAmount / totalInstallments;
  const dailyInterestRate = frequencyInterest(annualInterestRate, 365);

  const investmentAmount = fractionalUnitValue * unitsBought;

  const dates = [];
  const amounts = [];

  let remainingPrincipal = investmentAmount;

  // Initial investment outflow
  dates.push(disbursedDate);
  amounts.push(-investmentAmount);

  let currentDate = firstPaymentDate;
  let prevDate = disbursedDate;

  const cashflow = [];

  while (remainingPrincipal > 0) {
    const daysBetween = daysBetweenDates(prevDate, currentDate);
    const interestPayment = dailyInterestRate * daysBetween * remainingPrincipal;
    let principalPayment = (principalPerInstallment / numFractions) * unitsBought;

    if (principalPayment > remainingPrincipal) {
      principalPayment = remainingPrincipal;
    }

    const totalPayment = principalPayment + interestPayment;

    cashflow.push({
      date: currentDate.format('YYYY-MM-DD'),
      principalPayment,
      interestPayment,
      totalPayment,
      remainingPrincipal,
    });

    dates.push(currentDate);
    amounts.push(totalPayment);

    remainingPrincipal -= principalPayment;
    prevDate = currentDate;
    currentDate = getNextScheduleDate(currentDate, paymentFrequency);
  }

  const xirrValue = XIRR(amounts, dates);

  return {
    investmentAmount: Math.abs(amounts[0]),
    cashflow,
    xirr: xirrValue * 100,
  };
}
