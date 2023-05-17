import "core-js/stable";

/////////////////////////////////////////////////////////////

// Data
/////////////////////////////////////////////////////////////
const accounts = [
  {
    owner: "Sabuj Mahonta",
    movements: [2500, 500, -750, 1200, 3200, -1500, 500, 1200, -1750, 1800],
    interestRate: 1.5, // %
    password: 1234,
    movementsDates: [
      "2021-11-18T21:31:17.178Z",
      "2021-12-23T07:42:02.383Z",
      "2022-01-28T09:15:04.904Z",
      "2022-04-01T10:17:24.185Z",
      "2022-07-08T14:11:59.604Z",
      "2022-09-10T17:01:17.194Z",
      "2022-09-12T23:36:17.929Z",
      "2022-09-15T12:51:31.398Z",
      "2022-09-19T06:41:26.190Z",
      "2022-09-21T08:11:36.678Z",
    ],
    currency: "USD",
    locale: "en-US",
  },
  {
    owner: "Tumpa Rani",
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -300, 1500, -1850],
    interestRate: 1.3, // %
    password: 5678,
    movementsDates: [
      "2021-12-11T21:31:17.671Z",
      "2021-12-27T07:42:02.184Z",
      "2022-01-05T09:15:04.805Z",
      "2022-02-14T10:17:24.687Z",
      "2022-03-12T14:11:59.203Z",
      "2022-05-16T17:01:17.392Z",
      "2022-08-10T23:36:17.522Z",
      "2022-09-03T12:51:31.491Z",
      "2022-09-18T06:41:26.394Z",
      "2022-09-21T08:11:36.276Z",
    ],
    currency: "EUR",
    locale: "en-GB",
  },
];

/////////////////////////////////////////////////////////////
// Elements
/////////////////////////////////////////////////////////////
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance-value");
const labelSumIn = document.querySelector(".summary-value-in");
const labelSumOut = document.querySelector(".summary-value-out");
const labelSumInterest = document.querySelector(".summary-value-interest");
const labelTimer = document.querySelector(".timer");
const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");
const btnLogin = document.querySelector(".login-btn");
const btnLogout = document.querySelector(".logout-btn");
const btnTransfer = document.querySelector(".form-btn-transfer");
const btnLoan = document.querySelector(".form-btn-loan");
const btnClose = document.querySelector(".form-btn-close");
const btnSort = document.querySelector(".btn-sort");
const inputLoginUsername = document.querySelector(".login-input-username");
const inputLoginPassword = document.querySelector(".login-input-password");
const input = document.querySelector(".login-input");
const inputTransferTo = document.querySelector(".form-input-to");
const inputTransferAmount = document.querySelector(".form-input-amount");
const inputLoanAmount = document.querySelector(".form-input-loan-amount");
const inputCloseUsername = document.querySelector(".form-input-username");
const inputClosePassword = document.querySelector(".form-input-password");
const inputFill = document.querySelector(".login-input-username");
const inputFillPass = document.querySelector(".login-input-password");

/////////////////////////////////////////////////////////////////////////
//updateUI
////////////////////////////////////////////////////////////////////////
function updateUI(currentAccount) {
  displayMovements(currentAccount);
  displaySummary(currentAccount);
  displayBalance(currentAccount);
}
////////////////////////////////////////////////////////////////////////////
// Movements
///////////////////////////////////////////////////////////////////////////
let currentAccount, timer;

function displayMovements(account, sort = false) {
  containerMovements.innerHTML = "";
  const moves = sort ? account.movements.slice(0).sort((a,b)=> a-b) : account.movements;
  moves.forEach((move, i) => {
    // console.log(move);
    const type = move > 0 ? "deposit" : "withdrawal";
    const html = `
        <div class="movements-row">
        <div class="movements-type movements-type-${type}">${i + 1}
        ${type}</div>
        <div class="movements-date">5 days ago</div>
        <div class="movements-value">${move}$</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}

//////////////////////////////////////////////////////////////////////////////
// Summary
///////////////////////////////////////////////////////////////////////////////
function displaySummary(account) {
  // Incomes
  const incomes = account.movements
    .filter((move) => move > 0)
    .reduce((acc, deposit) => acc + deposit, 0);
  labelSumIn.textContent = `${incomes}$`;
  // Outcomes
  const outcomes = account.movements
    .filter((move) => move < 0)
    .reduce((acc, outcome) => acc + outcome, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}$`;

  //Interest
  const interest = account.movements
    .filter((move) => move > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((interest) => interest > 1)
    .reduce((acc, interest) => acc + interest, 0);

  labelSumInterest.textContent = `${interest}$`;
}

/////////////////////////////////////////////////////////////////
// Balance
////////////////////////////////////////////////////////////////

function displayBalance(account) {
  account.balance = account.movements.reduce((acc, move) => acc + move, 0);
  labelBalance.textContent = `${account.balance}$`;
}

////////////////////////////////////////////////////////////////////////
// create userName
/////////////////////////////////////////////////////////////////////////
function displayUserName(accounts) {
  accounts.forEach((account) => {
    account.userName = account.owner
      .toLowerCase()
      .split(" ")
      .map((word) => word.at(0))
      .join("");
  });
}
displayUserName(accounts);

////////////////////////////////////////////////////////////////////////////
// Login
///////////////////////////////////////////////////////////////////////////

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();

  currentAccount = accounts.find(
    (account) => account.userName === inputLoginUsername.value
  );

  if (currentAccount?.password === +inputLoginPassword.value) {
    // Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner
      .split(" ")
      .at(0)}`;
    labelWelcome.style.color = "#444";
    containerApp.style.opacity = 1;
    containerApp.style.visibility = "visible";
    btnLogout.style.opacity = 1;
    btnLogout.style.visibility = "visible";
    btnLogin.style.opacity = 0;
    inputFill.style.opacity = 0;
    inputFill.style.visibility = "hidden";
    inputFillPass.style.opacity = 0;
    inputFillPass.style.visibility = "hidden";

    // Update UI
    updateUI(currentAccount);
  } else {
    // Hide UI and display warning message
    labelWelcome.textContent = "Incorrect user or password!";
    labelWelcome.style.color = "#f3442a";
    containerApp.style.opacity = 1;
    containerApp.style.visibility = "visible";
  }

  // Clear input fields
  inputLoginUsername.value = inputLoginPassword.value = "";
  inputLoginPassword.blur();
});

/////////////////////////////////////////////////////////////////
// Transfer
////////////////////////////////////////////////////////////////

btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  const receiverAccount = accounts.find(
    (account) => account.userName === inputTransferTo.value
  );

  const amount = inputTransferAmount.value;

  if (
    amount > 0 &&
    amount <= currentAccount.balance &&
    currentAccount.userName !== receiverAccount.userName &&
    receiverAccount
  ) {
    // Transfer Money 
    currentAccount.movements.push(-amount)
    receiverAccount.movements.push(amount)
    // Update U
    updateUI(currentAccount)

    //Show Massage
    labelWelcome.textContent = "Transfer Successful"

  }else{
    labelWelcome.textContent = "transfer Fail !"
    labelWelcome.style.color = "#f3442a";
  }

  // clear fields
   inputTransferTo.value = inputTransferAmount.value ="";
  inputTransferAmount.blur();
});

//////////////////////////////////////////////////////////////////////
// Loan
///////////////////////////////////////////////////////////////////////

btnLoan.addEventListener("click", (e)=>{
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if(amount > 0 && currentAccount.movements.some(move => move >= amount  * 0.1) ){
    // add positive movement into current account
    currentAccount.movements.push(amount)

    //Update ui
    updateUI(currentAccount)

    //message
    labelWelcome.textContent = "loan successful"

    // clear fields 
    inputLoanAmount.value = "";
    inputLoanAmount.blur()

  }else{
    labelWelcome.textContent = "loan not success"
  }
})
///////////////////////////////////////////////////////////////////////////////
// Sort
///////////////////////////////////////////////////////////////////////////////
let sortMove = false;

btnSort.addEventListener("click", function(e){
  e.preventDefault();
  displayMovements(currentAccount, !sortMove)
  sortMove = !sortMove
})