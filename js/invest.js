const apiEntry = "https://backend.ulltraprofit.com";
const token = localStorage.getItem("btctrusttoken");
if (!token) {
  alert("You mus log in first");
  window.location.assign("../../login.html");
}
let currentPlan, currentCoin;
const coins = ["btc", "doge", "ethereum", "usdt"];
const planType = document.getElementById("plan-type");
const coinAlert = document.getElementById("coin-alert");
const amountInput = document.getElementById("amount");
const submitBtn = document.getElementById("submitBtn");
let amount = 0;
amountInput.addEventListener("change", (e) => {
  amount = e.target.value;
});
const plans = [
  "corporate",
  "starter",
  "premium",
  "ultimate",
  "standard",
  "exclusive",
];
// fetch coins details from API
fetch(`${apiEntry}/users/getcoins`)
  .then((res) => res.json())
  .then((data) => {
    if (data.success) {
      Object.keys(data.result)
        .filter((key) => !key.includes("_"))
        .forEach((coin) => {
          document.getElementById(`${coin}AddressValue`).innerHTML =
            data.result[coin];
        });
    }
  });

// display alerts and warnings

const displayAlert = (message, className, timer) => {
  coinAlert.style.opacity = "1";
  if (className) {
    coinAlert.classList.add(className);
  } else {
    coinAlert.classList.add("alert-primary");
  }
  coinAlert.innerHTML = message;
  setTimeout(() => {
    coinAlert.style.opacity = "0";
  }, timer || 3000);
};

const setPlan = (e) => {
  // Attempt to find the nearest ancestor (including the target itself) that matches one of the IDs in the plans array
  const relevantElement = e.target.closest(
    plans.map((plan) => `#${plan}`).join(", ")
  );

  // Check if a matching element was found
  if (relevantElement) {
    // This should now always log the parent element you're interested in, not a child
    // You can now safely apply styles or perform other actions on relevantElement
    // relevantElement.style.border = "1px solid green";
    currentPlan = relevantElement.id;
    relevantElement.style.border = "5px solid blue";
    relevantElement.style.padding = "15px";
    planType.innerHTML = relevantElement.id;
    const otherElements = plans.filter((plan) => plan !== relevantElement.id);
    otherElements.forEach((element) => {
      document.getElementById(element).style.border = "none";
      document.getElementById(element).style.padding = "0px";
    });
  }
};

plans.forEach((plan) => {
  const element = document.getElementById(plan);

  element.addEventListener("click", (e) => {
    setPlan(e);
  });
});

const setCoin = (e) => {
  const relevantElement = e.target.closest(
    coins.map((plan) => `#${plan}`).join(", ")
  );
  if (relevantElement) {
    document.querySelector(".coinAddresses").style.display = "block";
    currentCoin = relevantElement.id;
    console.log("currentCoin", currentCoin);
    relevantElement.style.border = "5px solid blue";
    relevantElement.style.borderRadius = "50%";
    document.getElementById(`${currentCoin}add`).classList.add("active");
    // display an alert

    // take off the border  of other coins
    const otherElements = coins.filter((coin) => coin !== relevantElement.id);
    otherElements.forEach((element) => {
      document.getElementById(element).style.border = "none";
      document.getElementById(`${element}add`).classList.remove("active");
    });
    displayAlert(
      `${currentCoin.toUpperCase()} has been selected as means of payment`
    );
  }
};
//  coins is an array of strings representing the ids of the coin images, so when they are clicked the coins is selected

coins.forEach((coin) => {
  const coinImg = document.getElementById(coin);
  coinImg.addEventListener("click", (e) => {
    setCoin(e);
  });
});

//  set limits for the plans
const boundaries = {
  starter: {
    min: 50,
    max: 499,
    perc: 15,
  },
  premium: {
    min: 500,
    max: 4999,
    perc: 40,
  },
  ultimate: {
    min: 10000,
    max: 49999,
    perc: 65,
  },
  standard: {
    min: 500,
    max: 999,
    perc: 25,
  },
  exclusive: {
    min: 5000,
    max: 9999,
    perc: 50,
  },
  corporate: {
    min: 50000,
    max: Infinity,
    perc: 80,
  },
};

// plans and  boundaries have been declared
//

//  functionality that copies wallet id
const copyWalletId = () => {
  const text = document.getElementById(`${currentCoin}AddressValue`).innerHTML;

  navigator.clipboard
    .writeText(text)
    .then(() => {
      displayAlert(
        `Wallet Id for ${currentCoin.toUpperCase()} has been copied successfully `
      );
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const checkForErrors = () => {
  const errors = [];
  // there is an error if :
  // 1. no plan was selected
  // 2.amount does not fall within the plan boundaries
  //  no coin was selected
  if (!currentPlan) {
    errors.push("You must Select a plan to continue");
  } else {
    const currentBoundary = boundaries[currentPlan];
    const amountFallsWithinPlan =
      amount >= currentBoundary.min && amount <= currentBoundary.max;
    if (!amountFallsWithinPlan) {
      errors.push(
        `With ${currentPlan} plan, you can invest between ${currentBoundary.min} and ${currentBoundary.max}`
      );
    }
  }
  if (!currentCoin) {
    errors.push(`Please select a coin to pay with`);
  }
  if (errors.length > 0) {
    displayAlert(
      `
    <h3>The following error occured:</h3>
    <ol>
    ${errors
      .map((err) => `<li style="margin:20px auto;"><b>${err}<b></li`)
      .join("\n")}
    </ol>
    `,
      "alert-secondary",
      7000
    );
  }
  return errors.length === 0;
};
const submitTransaction = () => {
  fetch(`${apiEntry}/requests/invest`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
    body: JSON.stringify({
      amount,
      coin: currentCoin,
      plan: currentPlan,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        displayAlert("Request has been sent succesfully");
        setTimeout(() => {
          window.location.assign("./userdashboard.html");
        }, 3000);
      } else {
        alert("An error occured");
      }
    });
};

const attemptToSubmit = () => {
  const noErrorsWereFound = checkForErrors();
  if (noErrorsWereFound) {
    submitTransaction();
  }
};
//logout functionality
//  deletes cached login token
// redirects user to home page

const logout = () => {
  localStorage.removeItem("btctrusttoken");
  window.location.assign("./index.html");
};
