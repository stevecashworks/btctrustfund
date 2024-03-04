const apiEntry = "http://localhost:8080";
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
        window.location.assign("./userdashboard.html")
      }
      else{
        alert(data.result)
        window.location.reload()
      }
    });
});
