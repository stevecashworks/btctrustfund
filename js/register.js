const apiEntry = "http://localhost:8080";

const submitBtn = document.getElementById("submitBtn");
const mail = document.getElementById("mail");
const pass = document.getElementById("password");
const name = document.getElementById("name");
const repassword = document.getElementById("repassword");
const mobile = document.getElementById("mobile");
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  const password = pass.value;
  const passwordCheck = repassword.value;
  if (password !== passwordCheck) {
    alert("passwords don't match");
  } else {
    const details = {
      email: mail.value,
      password,
      name: name.value,
      phone: mobile.value,
    };
    fetch(`${apiEntry}/users/register`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(details),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          localStorage.setItem("btctrusttoken", data.result.token);
          // window.location.assign("./index.html");
        } else {
          alert(data.result);
          submitBtn.disabled = false;
        }
      });
  }
});
