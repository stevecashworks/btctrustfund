const apiEntry = "https://backend.ulltraprofit.com";
const submitBtn = document.getElementById("submitBtn");
const pass = document.getElementById("password");
const mail = document.getElementById("email");

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const details = {
    email: mail.value,
    password: pass.value,
  };
  fetch(`${apiEntry}/users/login`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(details),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if(data.success){
        localStorage.setItem("btctrusttoken", data.result.token)
        const dashboard= data.result.isAdmin?"admin":"userdashboard"
        console.log(data.result)
        window.location.assign(`./${dashboard}.html`)
      }
      else{
        alert(data.result)
        window.location.reload()
      }
    });
});
