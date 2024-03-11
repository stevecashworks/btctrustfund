console.log("working");
const apiEntry = "https://backend.ulltraprofit.com";

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
      document.getElementById("totalUsers").innerHTML = result.length;
      document.getElementById("totalInvestment").innerHTML = result.reduce((a,b)=>a.balance+b.balance);
    
    } else {
      alert(result);
    }
  });
const logout = () => {
  localStorage.removeItem("btctrusttoken");
  window.location.assign("./index.html");
};