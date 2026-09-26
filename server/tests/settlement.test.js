const assert = require('assert');
const { calculateMemberBalances, calculateSettlements } = require('../utils/settlementAlgorithm');

console.log('Running Settlement Algorithm Unit Tests...\n');

let passedTests = 0;
let totalTests = 0;

function runTest(description, testFn) {
  totalTests++;
  try {
    testFn();
    console.log(`✅ PASS: ${description}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ FAIL: ${description}`);
    console.error(err);
  }
}

// Case 1: One creditor and one debtor
runTest('Case 1: One creditor and one debtor', () => {
  const balances = [
    { person: 'A', balance: 500 },
    { person: 'B', balance: -500 }
  ];
  const settlements = calculateSettlements(balances);
  assert.strictEqual(settlements.length, 1);
  assert.strictEqual(settlements[0].from, 'B');
  assert.strictEqual(settlements[0].to, 'A');
  assert.strictEqual(settlements[0].amount, 500);
});

// Case 2: Multiple creditors and one debtor
runTest('Case 2: Multiple creditors and one debtor', () => {
  const balances = [
    { person: 'A', balance: 300 },
    { person: 'B', balance: 200 },
    { person: 'C', balance: -500 }
  ];
  const settlements = calculateSettlements(balances);
  assert.strictEqual(settlements.length, 2);
  const totalPaidByC = settlements
    .filter(s => s.from === 'C')
    .reduce((sum, s) => sum + s.amount, 0);
  assert.strictEqual(totalPaidByC, 500);
});

// Case 3: One creditor and multiple debtors
runTest('Case 3: One creditor and multiple debtors', () => {
  const balances = [
    { person: 'A', balance: 1500 },
    { person: 'B', balance: -500 },
    { person: 'C', balance: -500 },
    { person: 'D', balance: -500 }
  ];
  const settlements = calculateSettlements(balances);
  assert.strictEqual(settlements.length, 3);
  settlements.forEach(s => {
    assert.strictEqual(s.to, 'A');
    assert.strictEqual(s.amount, 500);
  });
});

// Case 4: Multiple creditors and multiple debtors
runTest('Case 4: Multiple creditors and multiple debtors', () => {
  const balances = [
    { person: 'A', balance: 1000 },
    { person: 'B', balance: 500 },
    { person: 'C', balance: -800 },
    { person: 'D', balance: -700 }
  ];
  const settlements = calculateSettlements(balances);
  // Verify net zero after settlement
  const finalBalances = { A: 1000, B: 500, C: -800, D: -700 };
  settlements.forEach(s => {
    finalBalances[s.from] += s.amount;
    finalBalances[s.to] -= s.amount;
  });
  Object.keys(finalBalances).forEach(k => {
    assert.strictEqual(Math.abs(finalBalances[k]) < 0.01, true, `${k} balance should be 0`);
  });
  // Check minimal transaction count requirement
  assert(settlements.length <= 3);
});

// Case 5: Everyone already settled
runTest('Case 5: Everyone already settled', () => {
  const balances = [
    { person: 'A', balance: 0 },
    { person: 'B', balance: 0 },
    { person: 'C', balance: 0 }
  ];
  const settlements = calculateSettlements(balances);
  assert.strictEqual(settlements.length, 0);
});

// Case 6: Large number of members
runTest('Case 6: Large number of members (50 participants)', () => {
  const members = Array.from({ length: 50 }, (_, i) => ({ name: `User_${i}` }));
  // User_0 pays 5000 for all 50 members (100 per person)
  const expenses = [
    { amount: 5000, paidBy: 'User_0', participants: members.map(m => m.name) }
  ];
  const balances = calculateMemberBalances(members, expenses);
  const settlements = calculateSettlements(balances);
  assert.strictEqual(settlements.length, 49); // 49 debtors pay User_0
  assert.strictEqual(settlements[0].to, 'User_0');
  assert.strictEqual(settlements[0].amount, 100);
});

// Case 7: Decimal amounts
runTest('Case 7: Decimal amounts', () => {
  const balances = [
    { person: 'Alice', balance: 125.75 },
    { person: 'Bob', balance: -75.25 },
    { person: 'Charlie', balance: -50.50 }
  ];
  const settlements = calculateSettlements(balances);
  assert.strictEqual(settlements.length, 2);
  const totalSettled = settlements.reduce((sum, s) => sum + s.amount, 0);
  assert.strictEqual(totalSettled, 125.75);
});

// Case 8: Rounding issues (100 split 3 ways)
runTest('Case 8: Rounding issues (100 split 3 ways)', () => {
  const members = [{ name: 'A' }, { name: 'B' }, { name: 'C' }];
  const expenses = [
    { amount: 100, paidBy: 'A', participants: ['A', 'B', 'C'] }
  ];
  const balances = calculateMemberBalances(members, expenses);
  // Sum of net balances must be exactly 0 paise
  const totalNetPaise = balances.reduce((sum, b) => sum + b.balancePaise, 0);
  assert.strictEqual(totalNetPaise, 0);

  const settlements = calculateSettlements(balances);
  // Total settled should equal exact sum of debts
  const totalDebt = balances.filter(b => b.balancePaise < 0).reduce((sum, b) => sum + Math.abs(b.balancePaise), 0);
  const totalSettledPaise = settlements.reduce((sum, s) => sum + Math.round(s.amount * 100), 0);
  assert.strictEqual(totalSettledPaise, totalDebt);
});

console.log(`\nTest Summary: ${passedTests}/${totalTests} tests passed.`);
if (passedTests !== totalTests) {
  process.exit(1);
}
