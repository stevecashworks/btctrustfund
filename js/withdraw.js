const apiEntry = "https://backend.ulltraprofit.com";
const token = localStorage.getItem("btctrusttoken");
if (!token) {
  alert("We couldn't get your details,  log in ");
  window.location.assign("./login.html");
}

let UserDetails, amount, selectedCoin;

document.getElementById("amountInp").addEventListener("change", (e) => {
  amount = Math.abs(Number(e.target.value));
});

console.log(token);
fetch(`${apiEntry}/users/tklogin`, {
  method: "post",
  headers: {
    "Content-Type": "application/json",
    token: token,
  },
})
  .then((res) => res.json())
  .then((data) => {
    // console.log(data)
    if (data.success) {
      console.log(data);
      UserDetails = data.result;
      document.getElementById(
        "balanceCon"
      ).innerHTML = `$${UserDetails.balance}`;
      const updatedWallets = Object.keys(UserDetails.walletIds).filter(
        (item) => UserDetails.walletIds[item] !== "none"
      );

      //  display image of already updated wallets
      updatedWallets.forEach((coin) => {
        document.getElementById(coin).style.display = "block";
      });
      const noWalletsWereFound = updatedWallets.length === 0;
      const coinImgs = document.querySelectorAll(".coin-img");
      coinImgs.forEach((img) => {
        img.addEventListener("click", (e) => {
          const { id } = e.target;
          selectedCoin = id;
          document.getElementById(id).style.border = "2px solid blue";
          document.getElementById(
            "walletId"
          ).innerHTML = ` wallet-id: ${UserDetails.walletIds[selectedCoin]}`;
          document.getElementById("selectedCoin").innerHTML =
            selectedCoin.toUpperCase();
          coinImgs.forEach((img) => {
            if (img.id !== id) {
              document.getElementById(img.id).style.border = "none";
            }
          });
        });
      });
      if (noWalletsWereFound) {
        document.getElementById("noWallet").style.display = "block";
      }
    } else {
      alert("We couldn't get your details,  log in ");
      window.location.assign("./login.html");
    }
  });
const submitWithdrawal = () => {
  console.log({
    amount,
    wallet: { coin: selectedCoin, id: UserDetails.walletIds[selectedCoin] },
  });
  const errors = [];
  if (!selectedCoin) {
    errors.push(`Please select or add a wallet to withdraw into`);
  }
  if (!amount) {
    errors.push("Input  the amount you wish to withdraw");
  }
  if (amount > UserDetails.balance) {
    errors.push(` You do not have sufficient balance `);
  }
  errors.forEach((err) => {
    const errorElement = document.createElement("p");
    errorElement.innerHTML = err;
    errorElement.classList.add("mt-4");
    document.getElementById("errors").appendChild(errorElement);
  });
  if (errors.length > 0) {
    document.querySelector(".alert").style.opacity = "1";
    setTimeout(() => {
      document.querySelector(".alert").style.opacity = "0";
    }, 6000);
  } else {
    fetch(`${apiEntry}/requests/withdraw`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        amount,
        wallet: {
          coin: selectedCoin,
          walletId: UserDetails.walletIds[selectedCoin],
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          window.location.assign("userdashboard.html");
        }
      });
  }
};
const logout = () => {
  localStorage.removeItem("btctrusttoken");
  window.location.assign("./index.html");
};
