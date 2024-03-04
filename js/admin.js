console.log("working");
const apiEntry = "http://localhost:8080";
const token = localStorage.getItem("btctrusttoken");
fetch(`${apiEntry}/admin/getStats`, {
  method: "post",
  headers: {
    "Content-Type": "application/json",
    token: token,
  },
})
  .then((res) => res.json())
  .then((data) => {
    const {result}=  data 
    if (data.success) {
        console.log(result)
      document.getElementById("totalUsers").innerHTML = result.totalUsers;
      document.getElementById("totalInvestment").innerHTML = result.totalInvestment;
    
    } else {
      alert(result);
    }
  });
