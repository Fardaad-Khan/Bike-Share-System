// Bikes dataset with real images
const bikes = [
  { id:1, name:"Trek Marlin 7", type:"Road", img:"https://www.firststopboardbarn.com/cdn/shop/files/Marlin7-24-41217-A-Primary.png?v=1746565975&width=1920", available:true },
  { id:2, name:"Giant Talon 1", type:"Mountain", img:"https://mackcycle.com/cdn/shop/files/giant-talon-1-front-suspension-mountain-bike-black-1.jpg?v=1756494702&width=1214", available:true },
  { id:3, name:"Specialized Rockhopper", type:"Hybrid", img:"https://bikepacking.com/wp-content/uploads/2020/05/2021-specialized-rockhopper-2-2000x1333.jpg", available:true },
  { id:4, name:"Cannondale Trail 7", type:"Mountain", img:"https://www.sefiles.net/images/library/zoom/cannondale-trail-6-copy-211880-1.jpg", available:true },
  { id:5, name:"Scott Aspect 950", type:"Electric", img:"https://shop.playtrifortwaltonbeach.com/cdn/shop/products/image_8fafa277-97e7-4aed-934f-5e25a2dc017f_934x700.jpg?v=1706059729", available:true },
  { id:6, name:"GT Aggressor Expert", type:"Hybrid", img:"https://media.bikehub.co.za/production/Media/MarketplaceItem/2023/666114/-1693380967-9323.jpg", available:true },
  { id:7, name:"Merida Big Nine 300", type:"Mountain", img:"http://grundtner.com/cdn/shop/products/gn23IgxWTEWJBhAGp8P2JA_thumb_9cd3.jpg?v=1642771618", available:true },
  { id:8, name:"Cube Aim Pro", type:"Electric", img:"https://i0.wp.com/bike-test.com/wp-content/uploads/2022/12/23_248-1-scaled.jpg?fit=2560%2C1491&ssl=1", available:true },
  { id:9, name:"Specialized Sirrus X", type:"Hybrid", img:"http://bicyclewarehouse.com/cdn/shop/files/92425-95_SIRRUS-X-10-ST-KM-DPMRNBLU-GRYBLU_HERO-PDP.png?v=1726532499", available:true },
  { id:10, name:"Cannondale Quick 4", type:"Road", img:"https://c02.purpledshub.com/uploads/sites/39/2020/09/Cannondale-Quick-4-Disc-with-Cytronex-04-288108f.jpg?quality=45&resize=768,574", available:true },
  { id:11, name:"Aventon Pace 500", type:"Electric", img:"https://cdn.shoplightspeed.com/shops/632567/files/53843419/aventon-aventon-pace-500-step-over-30.jpg", available:true },
  { id:12, name:"RadCity 5 Plus", type:"Electric", img:"https://electricbikereview.com/wp-content/assets/2021/06/2021-rad-power-bikes-radcity-5-plus-stock-black.jpg", available:true },
  { id:13, name:"Lectric XP 3.0", type:"Electric", img:"https://electricbikereview.com/wp-content/assets/2024/07/Lectric-XP-3.0-profile-2.jpg", available:true }
];

const locations = ["AD Building","EN Engineering","BD Business","Library","ATC","AMDC"];

let users = JSON.parse(localStorage.getItem("users"))||[];
let currentUser = null;
let history = JSON.parse(localStorage.getItem("history"))||[];

// UI Elements
const bikeGrid = document.getElementById("bikeGrid");
const creditsDisplay = document.getElementById("credits");
const activeReservation = document.getElementById("activeReservation");
const filterInput = document.getElementById("filterInput");
const typeFilter = document.getElementById("typeFilter");
const authBtn = document.getElementById("authBtn");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const switchText = document.getElementById("switchText");
let switchMode = document.getElementById("switchMode");
const logoutBtn = document.getElementById("logoutBtn");
const pickupPoint = document.getElementById("pickupPoint");
const dropoffPoint = document.getElementById("dropoffPoint");
const resBikeName = document.getElementById("resBikeName");
const reserveDays = document.getElementById("reserveDays");
const confirmReserve = document.getElementById("confirmReserve");
const addCreditsBtn = document.getElementById("addCreditsBtn");
const paymentModal = document.getElementById("paymentModal");
const creditAmount = document.getElementById("creditAmount");
const cardNumber = document.getElementById("cardNumber");
const expiry = document.getElementById("expiry");
const cvv = document.getElementById("cvv");
const makePayment = document.getElementById("makePayment");
const historyBody = document.getElementById("historyBody");
const reserveModal = document.getElementById("reserveModal");
const authTitle = document.querySelector("#authCard h2");

let isLogin = true;

// Close modal function
function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

// Toggle auth mode
function toggleAuthMode() {
  isLogin = !isLogin;
  if (isLogin) {
    authTitle.textContent = "🚴‍♂️ Bike Share Login";
    authBtn.textContent = "Login";
    switchText.innerHTML = 'No account? <span id="switchMode">Signup</span>';
  } else {
    authTitle.textContent = "🚴‍♂️ Bike Share Signup";
    authBtn.textContent = "Signup";
    switchText.innerHTML = 'Have an account? <span id="switchMode">Login</span>';
  }
  switchMode = document.getElementById("switchMode");
  switchMode.onclick = toggleAuthMode;
}
switchMode.onclick = toggleAuthMode;

// AUTH
authBtn.onclick = () => {
  const u = usernameInput.value.trim();
  const p = passwordInput.value.trim();
  if (!u || !p) return alert("Please enter username and password");

  const found = users.find(x => x.u === u);

  if (isLogin) {
    if (!found || found.p !== p) return alert("Invalid credentials");
    currentUser = found;
  } else {
    if (found) return alert("User already exists");
    currentUser = { u, p, credits: 10, reservation: null };
    users.push(currentUser);
    localStorage.setItem("users", JSON.stringify(users));
  }

  document.getElementById("authCard").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  updateDashboard();
  renderBikes();
};

// Search filter
filterInput.oninput = () => renderBikes(filterInput.value, typeFilter.value);
typeFilter.onchange = () => renderBikes(filterInput.value, typeFilter.value);

// Logout
logoutBtn.onclick = () => {
  currentUser = null;
  location.reload();
};

// Populate pickup/drop
locations.forEach(loc => {
  pickupPoint.innerHTML += `<option>${loc}</option>`;
  dropoffPoint.innerHTML += `<option>${loc}</option>`;
});

// Render bikes
function renderBikes(search = "", type = "All") {
  bikeGrid.innerHTML = "";
  bikes
    .filter(b => (type === "All" || b.type === type) &&
                 (b.name.toLowerCase().includes(search.toLowerCase()) ||
                  b.type.toLowerCase().includes(search.toLowerCase())))
    .forEach(b => {
      const div = document.createElement("div");
      div.className = "bikeCard";
      div.innerHTML = `
        <img src="${b.img}" alt="${b.name}">
        <h4>${b.name}</h4>
        <p>Type: ${b.type}</p>
        <p class="${b.available ? "statusAvailable" : "statusReserved"}">${b.available ? "Available" : "Reserved"}</p>
        <button class="btnPrimary">${b.available ? "Reserve" : "Unreserve"}</button>
      `;
      div.querySelector("button").onclick = () => b.available ? showReserveModal(b) : unreserveBike(b);
      bikeGrid.appendChild(div);
    });
}

// Update dashboard top
function updateDashboard() {
  creditsDisplay.textContent = currentUser.credits.toFixed(1);
  if (currentUser.reservation) {
    activeReservation.textContent = `Reserved: ${currentUser.reservation.bikeName} from ${currentUser.reservation.pickup} to ${currentUser.reservation.dropoff} for ${currentUser.reservation.days} day(s)`;
  } else activeReservation.textContent = "";
  renderHistory();
}

// Reservation flow
function showReserveModal(bike) {
  if (currentUser.reservation) {
    return alert("You can only reserve one bike at a time. Please unreserve your current bike first.");
  }
  resBikeName.textContent = bike.name;
  reserveModal.style.display = "flex";
  updateCost();
  reserveDays.oninput = updateCost;
  function updateCost() {
    const d = parseInt(reserveDays.value) || 1;
    document.getElementById('costDisplay').textContent = `Cost: ${Math.ceil(d / 2)} credits`;
  }
  confirmReserve.onclick = () => {
    const d = parseInt(reserveDays.value);
    const cost = Math.ceil(d / 2);
    if (currentUser.credits < cost) return alert("Not enough credits");
    bike.available = false;
    currentUser.credits -= cost;
    currentUser.reservation = { bikeId: bike.id, bikeName: bike.name, days: d, pickup: pickupPoint.value, dropoff: dropoffPoint.value };
    history.push({ user: currentUser.u, bike: bike.name, days: d, date: new Date().toLocaleString() });
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("history", JSON.stringify(history));
    closeModal("reserveModal");
    updateDashboard();
    renderBikes();
  };
}

// Unreserve
function unreserveBike(bike) {
  if (currentUser.reservation && currentUser.reservation.bikeId === bike.id) {
    if (!confirm("Are you sure you want to unreserve? You will get a full refund.")) return;
    const refund = Math.ceil(currentUser.reservation.days / 2);
    currentUser.credits += refund;
    bike.available = true;
    currentUser.reservation = null;
    localStorage.setItem("users", JSON.stringify(users));
    updateDashboard();
    renderBikes();
  }
}

// History
function renderHistory() {
  historyBody.innerHTML = "";
  history.filter(h => h.user === currentUser.u)
    .forEach(h => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${h.date || 'N/A'}</td>
        <td>${h.bike}</td>
        <td>${h.days} day(s)</td>
      `;
      historyBody.appendChild(tr);
    });
}

// Add credits
addCreditsBtn.onclick = () => paymentModal.style.display = "flex";
makePayment.onclick = () => {
  const amt = parseInt(creditAmount.value);
  const card = cardNumber.value.trim();
  if (card === "4111111111111111") {
    currentUser.credits += amt;
    localStorage.setItem("users", JSON.stringify(users));
    updateDashboard();
    closeModal("paymentModal");
    alert("Payment successful!");
  } else alert("Payment failed");
}