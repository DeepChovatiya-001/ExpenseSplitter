/**
 * Minimum Transaction Settlement Algorithm (Greedy Debt-Settlement Approach)
 * 
 * Objectives:
 * 1. Calculate net balances for each person in a group.
 * 2. Minimize the total number of transactions required to settle all debts.
 * 3. Prevent floating-point rounding errors by performing calculations in minor currency units (e.g., paise for INR).
 * 
 * Time Complexity: O(N log N) where N is the number of group members.
 *   - Initial sorting of creditors and debtors takes O(N log N).
 *   - Each settlement step eliminates at least one participant, generating at most N-1 transactions.
 * Space Complexity: O(N) auxiliary space to store creditors, debtors, and output transactions.
 */

/**
 * Calculates net balances for a trip given its members and expenses.
 * @param {Array<{name: string}>} members - List of member objects
 * @param {Array<{amount: number, paidBy: string, participants: string[]}>} expenses - List of expense objects
 * @returns {Array<{person: string, totalPaid: number, totalShare: number, balance: number}>}
 */
function calculateMemberBalances(members, expenses) {
  const memberNames = members.map(m => (typeof m === 'string' ? m : m.name));
  
  // Initialize balance dictionary in integer minor units (paise)
  const stats = {};
  memberNames.forEach(name => {
    stats[name] = { totalPaidPaise: 0, totalSharePaise: 0 };
  });

  expenses.forEach(exp => {
    const amountPaise = Math.round(Number(exp.amount) * 100);
    const paidBy = exp.paidBy;

    // Credit the payer
    if (!stats[paidBy]) {
      stats[paidBy] = { totalPaidPaise: 0, totalSharePaise: 0 };
    }
    stats[paidBy].totalPaidPaise += amountPaise;

    // Equal split among participants
    const participants = exp.participants && exp.participants.length > 0 ? exp.participants : memberNames;
    const count = participants.length;
    if (count > 0) {
      const baseSharePaise = Math.floor(amountPaise / count);
      let remainder = amountPaise % count; // Distribute remainder 1-by-1 to avoid losing paise

      participants.forEach(pName => {
        if (!stats[pName]) {
          stats[pName] = { totalPaidPaise: 0, totalSharePaise: 0 };
        }
        let share = baseSharePaise;
        if (remainder > 0) {
          share += 1;
          remainder -= 1;
        }
        stats[pName].totalSharePaise += share;
      });
    }
  });

  // Calculate net balance for each person
  return Object.keys(stats).map(name => {
    const paid = stats[name].totalPaidPaise / 100;
    const share = stats[name].totalSharePaise / 100;
    const netPaise = stats[name].totalPaidPaise - stats[name].totalSharePaise;
    return {
      person: name,
      name: name,
      totalPaid: Number(paid.toFixed(2)),
      totalShare: Number(share.toFixed(2)),
      balance: Number((netPaise / 100).toFixed(2)),
      balancePaise: netPaise
    };
  });
}

/**
 * Generates an optimal list of minimal transactions to settle all debts.
 * @param {Array<{person: string, balance: number, balancePaise?: number}>} memberBalances
 * @returns {Array<{from: string, to: string, amount: number}>}
 */
function calculateSettlements(memberBalances) {
  // Convert balances to integer minor units (paise) if not already present
  const creditors = [];
  const debtors = [];

  memberBalances.forEach(item => {
    const personName = item.person || item.name;
    const paise = item.balancePaise !== undefined ? item.balancePaise : Math.round(item.balance * 100);

    if (paise > 0) {
      creditors.push({ name: personName, balancePaise: paise });
    } else if (paise < 0) {
      debtors.push({ name: personName, balancePaise: Math.abs(paise) });
    }
  });

  const transactions = [];

  // Sort initially
  creditors.sort((a, b) => b.balancePaise - a.balancePaise); // largest creditor first
  debtors.sort((a, b) => b.balancePaise - a.balancePaise);   // largest debtor (absolute value) first

  let cIndex = 0;
  let dIndex = 0;

  while (cIndex < creditors.length && dIndex < debtors.length) {
    const creditor = creditors[cIndex];
    const debtor = debtors[dIndex];

    const settlePaise = Math.min(creditor.balancePaise, debtor.balancePaise);
    const amount = Number((settlePaise / 100).toFixed(2));

    if (settlePaise > 0) {
      transactions.push({
        from: debtor.name,
        to: creditor.name,
        amount: amount
      });
    }

    creditor.balancePaise -= settlePaise;
    debtor.balancePaise -= settlePaise;

    if (creditor.balancePaise === 0) {
      cIndex++;
    }
    if (debtor.balancePaise === 0) {
      dIndex++;
    }
  }

  return transactions;
}

module.exports = {
  calculateMemberBalances,
  calculateSettlements
};
