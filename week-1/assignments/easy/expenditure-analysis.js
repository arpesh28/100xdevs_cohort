/*
  Implement a function `calculateTotalSpentByCategory` which takes a list of transactions as parameter
  and return a list of objects where each object is unique category-wise and has total price spent as its value.
  Transaction - an object like { itemName, category, price, timestamp }.
  Output - [{ category1 - total_amount_spent_on_category1 }, { category2 - total_amount_spent_on_category2 }]
*/

function calculateTotalSpentByCategory(transactions) {
  const hash = {},
    result = [];
  for (let t of transactions) {
    if (hash[t.category]) hash[t.category] += t.price;
    else hash[t.category] = t.price;
  }
  for (const [key, value] of Object.entries(hash)) {
    result.push({ category: key, totalSpent: value });
  }
  return result;
}

module.exports = calculateTotalSpentByCategory;
