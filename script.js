function showMessage(){
  alert("Welcome to Netflix Clone");
}

function logout(){

    localStorage.removeItem("user");

    window.location.href = "login.html";
}