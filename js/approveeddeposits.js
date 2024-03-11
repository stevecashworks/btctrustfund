const apiEntry = "https://backend.ulltraprofit.com";
const investmentTable = document.getElementById("investmentTable");
const token = localStorage.getItem("btctrusttoken");
let users;
fetch(`${apiEntry}/admin/getStats`, {
  method: "post",
  headers: {
    "Content-Type": "application/json",
    token,
  },
})
  .then((res) => res.json())
  .then((data) => {
    if (data.success) {
      users = data.result;
    }
  });
setTimeout(() => {
  fetch(`${apiEntry}/admin/getinvestments`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      token,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        const { result } = data;
        result
          .filter((x) => x.status === "approved")
          .forEach((investment, index) => {
            console.log(investment.coin);
            const { userId, amount, coin } = investment;
            const thisUser = users.find((user) => user._id === userId);
            const userName = thisUser.name.toUpperCase();
            const row = document.createElement("tr");
            const numCon = document.createElement("td");
            const nameCon = document.createElement("td");
            const amountCon = document.createElement("td");
            const coinCon = document.createElement("td");
            const actions = document.createElement("td");
            actions.setAttribute("class", "actions");
            const deleteBtn = document.createElement("button");
            const approveBtn = document.createElement("button");
            approveBtn.innerHTML = "Approve";
            deleteBtn.innerHTML = "Decline";
            approveBtn.setAttribute("class", "btn btn-outline-success");
            deleteBtn.setAttribute("class", "btn btn-outline-danger");
            approveBtn.onclick = () => {
              processInvestment("decline", investment._id);
            };
            actions.appendChild(approveBtn);
            actions.appendChild(deleteBtn);
            numCon.innerHTML = index + 1;
            nameCon.innerHTML = userName;
            amountCon.innerHTML = `$${amount}`;
            coinCon.innerHTML = coin.toUpperCase();

            row.appendChild(numCon);
            row.appendChild(nameCon);
            row.appendChild(amountCon);
            row.appendChild(coinCon);
            // row.appendChild(actions);
            investmentTable.appendChild(row);
          });
      } else {
      }
    });
}, 5000);
