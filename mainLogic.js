// UI SETUP BASED ON LOGIN
// --------------------------
function setUpUi() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || 'null');
  document.getElementById("loginBtn").style.display = token ? "none" : "inline-flex";
  document.getElementById("registerBtn").style.display = token ? "none" : "inline-flex";
  document.getElementById("logoutBtn").style.display = token ? "inline-flex" : "none";
  if(addpost != null){
      document.getElementById("addpost").style.display = token ? "block" : "none";

  }
  document.getElementById("userProfile").style.display = token ? "inline-block" : "none";
  document.getElementById("navUserName").style.display = token ? "inline-block" : "none";
  if (user) {
    document.getElementById("navUserName").innerText = user.username;
const profileSrc = user && user.profile_image && typeof user.profile_image === 'string'
  ? user.profile_image
  : "imgs/download.png";

document.getElementById("userProfile").src = profileSrc;
  }
}

//===========Auth=================//
// --------------------------
// LOGIN
// --------------------------
function loginForm() {
  const username = document.getElementById("username-input").value;
  const password = document.getElementById("password-input").value;

  axios.post(`${baseUrl}/login`, { username, password })
    .then(response => {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      alertMessage("Logged in successfully");
      bootstrap.Modal.getInstance(document.getElementById("loginModal")).hide();
      setUpUi();
    })
    .catch(error => alertMessage(error.response.data.message, "danger"));
}

// --------------------------
// REGISTER
// --------------------------
function registerForm() {
  const username = document.getElementById("username-input-register").value;
  const password = document.getElementById("password-input-register").value;
  const name = document.getElementById("name-input-register").value;
  const image = document.getElementById("image-input-register").files[0];

  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("name", name);
  if (image) formData.append("image", image);

  axios.post(`${baseUrl}/register`, formData, { headers: { "Content-Type": "multipart/form-data" } })
    .then(response => {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      alertMessage("Registered successfully");
      bootstrap.Modal.getInstance(document.getElementById("registerModal")).hide();
      setUpUi();
    })
    .catch(error => alertMessage(error.response.data.message, "danger"));
}
// --------------------------
// LOGOUT
// --------------------------
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  alertMessage("Logged out successfully");
  setUpUi();
}

// --------------------------
// ALERT FUNCTION (AUTO HIDE)
// --------------------------
function alertMessage(message, type = "success") {
  const placeholder = document.getElementById("liveAlertPlaceholder");
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
  placeholder.append(wrapper);
  setTimeout(() => {
    bootstrap.Alert.getOrCreateInstance(wrapper.querySelector(".alert")).close();
  }, 3000);
}
