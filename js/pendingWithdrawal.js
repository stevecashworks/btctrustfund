const apiEntry = "http://localhost:8080";
const token = localStorage.getItem("btctrusttoken");
const userTable = document.getElementById("userTable");
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
const edit = (id, task, username, amount) => {
  const canProceed = confirm(
    `Are you sure you want to ${task} the withdrawal of $${amount} by ${username}`
  );
  if (canProceed) {
    fetch(`${apiEntry}/admin/${task}withdrawal/${id}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          alert("Successful");
          window.location.reload();
        } else {
          alert("an error occured, try again");
        }
      });
  }
};
setTimeout(() => {
  fetch(`${apiEntry}/admin/getwithdrawals`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      token,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.success) {
        data.result.filter(withdrawal=>withdrawal.status==="pending").forEach((withdrawal, index) => {
          const row = document.createElement("tr");
          const sn = document.createElement("td");
          const name = document.createElement("td");
          const walletId = document.createElement("td");
          const email = document.createElement("td");
          const balance = document.createElement("td");
          const action = document.createElement("td");
          const declinebtn = document.createElement("button");
          const approveBtn = document.createElement("button");
          const thisUser = users.find((user) => user._id === withdrawal.userId);

          // approveBtn.setAttribute("href", `./editUser.html?id=${withdrawal._id}`);
          approveBtn.innerHTML = "Approve";
          declinebtn.innerHTML = "Decline";
          declinebtn.setAttribute("class", "btn deleteBtn btn-outline-danger");
          approveBtn.setAttribute("class", "btn deleteBtn btn-outline-success");
          approveBtn.onclick = () => {
            edit(withdrawal._id, "approve", thisUser.name, withdrawal.amount);
          };
          declinebtn.onclick = () => {
            edit(withdrawal._id, "decline", thisUser.name, withdrawal.amount);
          };
          action.setAttribute("class", "action");
          action.appendChild(approveBtn);
          action.appendChild(declinebtn);
          sn.innerHTML = index + 1;
          name.innerHTML = thisUser.name;
          email.innerHTML = withdrawal.amount;
          balance.innerHTML = `${withdrawal.wallet.coin}`;
          walletId.innerHTML = withdrawal.wallet.walletId;

          const elements = [sn, name, email, balance, walletId, action];

          elements.forEach((el) => {
            row.appendChild(el);
          });

          userTable.appendChild(row);
        });
      }
    });
}, 5000);


const logout = () => {
  localStorage.removeItem("btctrusttoken");
  window.location.assign("./index.html");
};