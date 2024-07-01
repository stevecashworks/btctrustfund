const apiEntry = "https://btctrust-api-1.onrender.com";
const token = localStorage.getItem("btctrusttoken");
const userTable = document.getElementById("userTable");

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
      data.result.forEach((user, index) => {
        const row = document.createElement("tr");
        const sn = document.createElement("td");
        const name = document.createElement("td");
        const email = document.createElement("td");
        const balance = document.createElement("td");
        const action = document.createElement("td");
        const btn = document.createElement("button");
        const editBtn = document.createElement("a");
        editBtn.setAttribute("href", `./editUser.html?id=${user._id}`);
        editBtn.innerHTML = "Edit user";
        btn.innerHTML = "Delete user";
        btn.setAttribute("class", "btn deleteBtn btn-outline-danger");
        editBtn.setAttribute("class", "btn deleteBtn btn-outline-success");
        action.appendChild(btn);
        action.setAttribute("class", "action");
        action.appendChild(editBtn);
        sn.innerHTML = index + 1;
        name.innerHTML = user.name;
        email.innerHTML = user.email;
        balance.innerHTML = `$${user.balance}`;

        const elements = [sn, name, email, balance, action];

        elements.forEach((el) => {
          row.appendChild(el);
        });

        userTable.appendChild(row);
      });
    }
  });
const logout = () => {
  localStorage.removeItem("btctrusttoken");
  window.location.assign("./index.html");
};
