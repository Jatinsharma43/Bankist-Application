'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements; //creating copy using slice

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
displayMovements(account1.movements);
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0]) // arrow function
      .join(''); // return string
  });
};
createUsernames(accounts);
const updateUI = function (acc) {
  displayMovements(acc.movements);
  calcDisplaySummary(acc);
  calcDisplayBalance(acc);
};
// console.log(accounts);
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance}€`;
};
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `${incomes}€`;
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

let currentAccount;
btnLogin.addEventListener('click', function (e) {
  // this method prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    // like filter
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `welcomeback${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();
    updateUI(currentAccount);
  }
});
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // console.log('valid transfer');
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    // Update UI
    updateUI(currentAccount);
  }
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //approve loan
    currentAccount.movements.push(amount);

    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  }
  inputTransferAmount.value = inputTransferTo.value = '';
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// const userName = user.toLowerCase().split(' ').map(function(name) {
//   return name[0]
// }).join('');
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// 6

/////////////////////////////////////////////////
//                              1
// let arr = ['a', 'b', 'c', 'd', 'e'];
// slice
// console.log(arr.slice(2));//['c', 'd', 'e']
// console.log(arr.slice(2,4));//['c', 'd']
// console.log(arr.slice(-1));//['e']
// console.log(arr.slice(1,-2));//['b', 'c']
// console.log(arr.slice()); //['a', 'b', 'c', 'd', 'e'] // copying using slice
// splice
//console.log(arr.splice(2));//['c', 'd', 'e']
// console.log(arr);//['a', 'b']
// arr.splice(-1) // removed e from the original array
// arr.splice(1,2); // del 2 elements
// console.log(arr);
//reverse
// let arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j','i','h','g','f'];
// console.log(arr2.reverse()); // original arr2 reversed
// concat
// const letters = arr.concat(arr2);
// console.log(letters);
//join
// console.log(letters.join(' _')); // return string
/////////////////////////////////////////////////
//                                  2(new at method)
// const arr = [23, 11, 64];
// console.log(arr[0]); // old method
// console.log(arr.at(0)); // same as above // new method
// console.log(arr.slice(-1)[0]);//64
// console.log(arr.at(-1));//64
// perfect for method chaining
// works on string to
// console.log('jatin'.at(2));//t
/////////////////////////////////////////////////
//                                  3(looping:foreach)
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// console.log(movements);
// for(const i of movements) {
//     if(i > 0) console.log(`You deposited ${i}`)
//         else console.log(`You withdrew ${Math.abs(i)}`);
// }
// movements.forEach(function (val, ind, arr) {
//   if (val > 0) {
//     console.log(
//       `You deposited ${val} at index ${ind + 1} and the array is ${arr}`
//     );
//   } else {
//     console.log(`You withdrew ${Math.abs(val)}`);
//   }
// });
/////////////////////////////////////////////////
//                                  4(foreach with maps ans sets)
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);
// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// const currenciesUnique = new Set(['USD','GBP','USD','EUR']);
// currenciesUnique.forEach(function (value, _ , map) {
//   console.log(`${value}: ${value}`);
//   });
///////////////////////////////////////
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
// const checkDogs = function (dogsJulia, dogsKate) {
//   const dogsJuliaCorrected = dogsJulia.slice();
//   dogsJuliaCorrected.splice(0, 1);//remove 0
//   dogsJuliaCorrected.splice(-2);//remove last
//   const dogs = dogsJuliaCorrected.concat(dogsKate);
//   dogs.forEach(function (dog, i) {
//     if (dog >= 3) {
//       console.log(`Dog number ${i + 1} is an adult, and is ${dog
//         } years old`
//         );
//         } else {
//           console.log(`Dog number ${i + 1} is still a puppy 🐶 an
//             is ${dog} years old`
//             );
//             }
// });
// }
// checkDogs([3, 5, 2, 12, 7],[4, 1, 15, 8, 3]);
////////////////////////////////////////
//                            5(the map method)
//similar to for each the only difference is that it creates new array based on the original array also applies a callback function to each iteration
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const euroToUsd = 1.1;
// const movementsUSD = movements.map(function(mov) {
//   return mov * euroToUsd;
// });
// console.log(movementsUSD);
// const movementUsdFor = [];
// for (const mov of movements) {
//   movementUsdFor.push(mov * euroToUsd);
//   }
//   console.log(movementUsdFor); // similar to map method but bad practice
// const movementsUSD = movements.map((mov)=> mov * euroToUsd);
// console.log(movementsUSD);
// const movementDescription = movements.map(
//   (val, i, arr) =>
//     `Movement ${i + 1} : You ${val > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
//       val
//     )} euros`
// );
// console.log(movementDescription);
////////////////////////////////////////////
//                            6(the filter method)
// RETURNS A NEW ARRAY CONTAINING THE ARRAY ELEMENT THAT PASSES A SPECIFIC TEST
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(deposits);
// we can also do it for loop
////////////////////////////////////////////
//                            7(the reduce method)
// REDUCE IS A MORE POWERFUL VERSION OF THE MAP METHOD
// it reduces all araay elements down to one single value
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const balance = movements.reduce(function(acc,val,i,arr) {
//   console.log(`Iteration ${i}: ${acc}`);
//   return acc + val
// },0);
// let balance2 = 0;
// for (const mov of movements) {
//   balance2 += mov;
//   }
// console.log(balance);
// console.log(balance2);
// maximum value
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) {
//     return acc;
//   } else {
//     return mov;
//   }
// }, movements[0]);
// console.log(max);
///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages.map(age => (age <= 2 ? age * 2 : 16 + age * 4));
//   console.log(humanAges);
//   const adults = humanAges.filter(age => age >= 18);
//   console.log(adults);
//   const average = adults.reduce((acc, age, i, arr)=> acc+age/arr.length,0);
//   return average;
// };

// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]
// ));
////////////////////////////////////////
//                          8(chaining)
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const eurToUsd = 1.1;
// const totalDepositsUSD = movements.filter(mov=>mov>0).map(mov => mov*eurToUsd).reduce((acc,mov)=> acc+mov,0);
// console.log(totalDepositsUSD);
// const totalDepositsUSD = movements.filter(mov=>mov>0).map((mov,i,arr) => {
//   console.log(arr);
//   return mov * eurToUsd;
//   }).reduce((acc,mov,i,arr)=>{
//     console.log(arr);
//     return acc+mov,0
//   });
// console.log(totalDepositsUSD);
///////////////////////////////////////
// Coding Challenge #3

/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages.map(age => (age <= 2 ? age * 2 : 16 + age * 4));
//   console.log(humanAges);
//   const adults = humanAges.filter(age => age >= 18);
//   console.log(adults);
//   const average = adults.reduce((acc, age, i, arr)=> acc+age/arr.length,0);
//   return average;
// };
// const calcAverageHumanAge = ages =>
//  ages
//     .map(age => (age <= 2 ? age * 2 : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));
///////////////////////////////////////////
//                          9(the find method)
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const firstWithdrawl = movements.find(mov=>mov<0);
// console.log(firstWithdrawl);
// // similar to filter method but insted of returning new array it only returns the first element that satisfied the condition
// console.log(accounts);
// const account = accounts.find(acc=>acc.owner==='Jessica Davis');
// console.log(account);
//////////////////////////////////////////
//                          10(THE FINDINDEX METHOD)
// SIMILAR TO FIND METHOD THE ONLY DIFFERENCE IS THAT IT RETURNS INDEX INSTEAD OF ELEMENT
/////////////////////////////////////////
//                          11(some and every)
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// console.log(movements);
// console.log(movements.includes(-130)); // true // test for equality
// // if we want to test for condition we use sum
// const anyDeposits = movements.some(mov => mov > 0);
// const anyDeposits2 = movements.some(mov => mov > 1500);
// console.log(anyDeposits);
// // every only returns true when all of the elements of an array satisfy the condition
// const allDeposits = movements.every(mov => mov > 0);
// console.log(allDeposits);//false
// // separate callback
// const deposit = mov => mov>0;
// console.log(movements.some(deposit));
//////////////////////////////////////////
//                          12(flat and flatmap)
// const arr = [[1,2,3],[4,5,6],7,8];
// console.log(arr.flat());
// // const[[a,b,c],[d,e,f],g,h] = arr;
// // console.log(a,b,c,d,e,f,g,h);
// const deep = [[[1,2],3],[4,[5,6]],7,8];
// console.log(deep.flat(2)); // [1, 2, 3, 4, 5, 6, 7, 8] // here 2 is depth argument
// const accountMovement = accounts.map(acc=>acc.movements);
// console.log(accountMovement);
// const allMovements = accountMovement.flat();
// console.log(allMovements);
// // const overallBal = accounts.map(acc=>acc.movements).flat().reduce((acc,mov)=> acc+mov,0);
// // console.log(overallBal);
// // flatmap
// // it is the combination of flat and map
// const overallBal = accounts.flatMap(acc=>acc.movements).reduce((acc,mov)=> acc+mov,0);
// console.log(overallBal);
//////////////////////////////////////////
//                            13(sorting arrays)
// const owners = ['Jonas Schmedtmann', 'Zach Sharp', 'Adam', 'martha'];
// console.log(owners.sort());
// by default it sorts alphabetically
// but we can change the sorting order by passing a callback function
// the callback function takes two arguments and returns a number
// if the number is positive the first argument will come before the second argument
// if the number is negative the first argument will come after the second argument
// if the number is zero the order will remain the same
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// console.log(movements.sort());//sort based on string convert number to string
//[-130, -400, -650, 1300, 200, 3000, 450, 70]
// we can change the sorting order by passing a callback function
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
//   return 0;
// });
// movements.sort((a,b)=>a-b);
// console.log(movements); //-650, -400, -130, 70, 200, 450, 1300, 3000]
// movements.sort((a,b)=>b-a);// descending order
////////////////////////////////////////////
//                                14(more ways)
// console.log([1, 2, 3, 4, 5, 6, 7]);
// console.log(new Array(1, 2, 3, 4, 5, 6, 7, 8));
// const x = new Array(7); // creates new array with 7 empty elements
// console.log(x);
// // x.fill(1);// mutate original array
// x.fill(1, 3, 5);
// console.log(x);
// const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// arr.fill(23, 2, 6);
// console.log(arr);
// const y = Array.from({ length: 7 }, () => 1);
// console.log(y); //[1, 1, 1, 1, 1, 1, 1]
// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z); //[1, 2, 3, 4, 5, 6, 7]
// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(document.querySelectorAll('.movements__value'),el=>Number(el.textContent.replace('€','')));
//   console.log(movementsUI);
// });
////////////////////////////////////////////
//                               array method practice
//1
// const bankDepositSum = accounts.map(acc=>acc.movements).flat(2);
// const bankDepositSum = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov > 0)
//   .reduce((sum, cur) => sum + cur, 0);
// console.log(bankDepositSum);
// //2
// // const numDeposit1000 = accounts
// //   .flatMap(acc => acc.movements)
// //   .filter(mov => mov > 1000).length;
// const numDeposit1000 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);
// console.log(numDeposit1000);
// //3
// const sums = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       // cur > 0 ? (sums.deposits += cur) : (sums.withdrawls += cur);
//       sums[cur > 0 ? 'deposits' : 'withdrawls'] += cur;
//       return sums;
//     },
//     { deposits: 0, withdrawls: 0 }
//   );
// console.log(sums);
// //4
// // this is a nice title = This Is a Nice Title
// const convertTitleCase = function (title) {
//   const capitalize = str => str[0].toUpperCase() + str.slice(1);
//   const expections = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with'];
//   const titleCase = title
//     .toLowerCase()
//     .split(' ')
//     .map(word => (expections.includes(word) ? word : capitalize(word)))
//     .join(' ');
//   return capitalize(titleCase);
// };
// console.log(convertTitleCase('this is a nice title'));
////////////////////////////////////////
// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀
*/
// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];
// // 1
// dogs.forEach(dog => {
//   dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
//   // console.log(dogs);
// });
// //2
// const sarahsDog = dogs.find(dog => dog.owners.includes('Sarah'));
// console.log(sarahsDog);
// console.log(
//   `Sarah's dog is eating ${
//     sarahsDog.curFood > sarahsDog.recommendedFood ? 'much' : 'little'
//   }`
// );
// //3
// const ownersEatTooMuch = dogs
//   .filter(dog => dog.curFood > dog.recommendedFood)
//   .flatMap(dog => dog.owners);
// console.log(ownersEatTooMuch);
// const ownersEatTooLittle = dogs
//   .filter(dog => dog.curFood < dog.recommendedFood)
//   .flatMap(dog => dog.owners);
// console.log(ownersEatTooLittle);
// //4
// console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
// console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);
// //5
// console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));
// //6
// const checkEatingOkay = dog =>
//   dog.curFood > dog.recommendedFood * 0.9 &&
//   dog.curFood < dog.recommendedFood * 1.1;

// console.log(dogs.some(checkEatingOkay));
// //7
// console.log(dogs.filter(checkEatingOkay));
// //8
// const dogsSorted = dogs.slice().sort((a, b) => {
//   return a.recommendedFood - b.recommendedFood;
// });
// console.log(dogsSorted);
