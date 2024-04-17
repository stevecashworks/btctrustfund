const apiEntry= "https://btctrustfunds.onrender.com"
let UserDetails;
let walletId=""
let selectedCoin="none"
const token = localStorage.getItem("btctrusttoken");
console.log(document.getElementById("idInput"));
document.getElementById("idInput").addEventListener("change", (e)=>{
 walletId=e.target.value
})
console.log(token);
if (!token) {
  window.location.assign("./index.html");
}
fetch(`${apiEntry}/users/tklogin`, {
  method: "post",
  headers: {
    "Content-Type": "application/json",
    token: token,
  },
})
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    if(data.success){
        const submitBtn=document.getElementById("submitBtn")
        const coinImgs = document.querySelectorAll(".coin-img");
        coinImgs.forEach(img=>{
            img.addEventListener("click", (e)=>{
                const {id}= e.target
                selectedCoin=id
                document.getElementById(id).style.border="2px solid blue"
                document.getElementById("selectedCoin").innerHTML=selectedCoin.toUpperCase()
                coinImgs.forEach(img=>{
                    if(img.id!==id){
                        
                        document.getElementById(img.id).style.border="none"

                    }
                })
            })
        })
        submitBtn.onclick=()=>{
            console.log({selectedCoin,walletId})
            if((selectedCoin!=="none")&&(walletId.length>0)){
                fetch(`${apiEntry}/users/addwallet`,{
                    method:"post",
                    headers:{
                        "Content-Type":"application/json",
                        "token":token
                    },
                    body:JSON.stringify({coin:selectedCoin,id:walletId})
                }).then(res=>res.json()).then(data=>{
                    console.log(data)
                    if(data.success){
                        alert("Info updated successfully")
                        window.location.assign("./withdraw.html")
                    }
                })

            }
            else{
                alert("Please fill all the information correctly")
            }
        }
        
        
    }
    else{
        window.location.reload()
    }
  });
