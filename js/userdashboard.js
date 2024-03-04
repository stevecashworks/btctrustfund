const apiEntry = "http://localhost:8080";
const userName = document.querySelectorAll(".username");
const balanceCon = document.getElementById("balance");
const earningsCon = document.getElementById("earnings");
const lastDepositCon = document.getElementById("lastDeposit");
const refCon = document.getElementById("ref");
console.log(userName);
const token = localStorage.getItem("btctrusttoken");
fetch(`${apiEntry}/users/tklogin`, {
  method: "post",
  headers: {
    "Content-Type": "application/json",
    token: token,
  },
})
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    balanceCon.innerHTML = `$${data.result.balance}`;
    lastDepositCon.innerHTML = `$${data.result.lastDeposit || 0}`;
    document.title = `${data.result.name}'s dashboard`.toUpperCase();
    document.getElementById(
      "pendingWithdrawal"
    ).innerHTML = `$${data.result.pendingWithdrawal||0}`;
    document.getElementById("lastWithdrawal").innerHTML=`$${data.result.lastWithdrawal||0}`
    earningsCon.innerHTML = `$${data.result.earnings}`;
    refCon.innerHTML = data.result.referralBonus;
    console.log(data.result.name);
    userName.forEach((el) => (el.innerHTML = data.result.name.toUpperCase()));
  });

//logout functionality
//  deletes cached login token
// redirects user to home page

//  fetch total stats from api

fetch(`${apiEntry}/users/getStats`, {
  method: "post",
  headers: {
    "Content-Type": "application/json",
    token: localStorage.getItem("btctrusttoken"),
  },
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    if (data.success) {
      console.log(data.result)
      document.getElementById(
        "totalDeposit"
      ).innerHTML = `$${data.result.totalDeposit}`;
      document.getElementById(
        "totalWithdrawal"
      ).innerHTML = `$${data.result.totalWithdrawal}`;
      
    }
  });

const logout = () => {
  localStorage.removeItem("btctrusttoken");
  window.location.assign("./index.html");
};
