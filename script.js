// ---- Edit these ----
const WHATSAPP_NUMBER = "919999999999"; // country code + number, no + or spaces
const PROPERTIES = [
  {title:"DTCP approved plot, 2 cents", city:"Madurai", type:"plot", lakhs:18, size:"2 cents", note:"Near Ring Road, 30 ft road"},
  {title:"3 BHK independent house", city:"Madurai", type:"house", lakhs:72, size:"1,850 sq ft", note:"East facing, ready to move"},
  {title:"2 BHK gated apartment", city:"Chennai", type:"apartment", lakhs:64, size:"980 sq ft", note:"Near OMR, RERA registered"},
  {title:"Villa plot", city:"Coimbatore", type:"plot", lakhs:42, size:"4 cents", note:"Gated layout, Saravanampatti side"},
  {title:"Coconut farmland, 3 acres", city:"Pollachi", type:"farm", lakhs:135, size:"3 acres", note:"Borewell and fencing included"},
  {title:"3 BHK apartment", city:"Trichy", type:"apartment", lakhs:58, size:"1,320 sq ft", note:"Lift, covered parking"},
  {title:"Residential plot", city:"Salem", type:"plot", lakhs:24, size:"1,200 sq ft", note:"Clear patta, EC available"},
  {title:"Independent house", city:"Tirunelveli", type:"house", lakhs:48, size:"1,500 sq ft", note:"Near bus stand, 2 floors"}
];
// --------------------

const TYPE_LABEL = {plot:"Plot", house:"House", apartment:"Apartment", farm:"Farmland"};
const $ = id => document.getElementById(id);
let lang = "en";

const price = l => l >= 100 ? `₹${(l/100).toFixed(2).replace(/\.?0+$/,"")} crore` : `₹${l} lakh`;
const wa = text => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
const esc = s => s.replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

function fillCities(){
  [...new Set(PROPERTIES.map(p => p.city))].sort().forEach(c => {
    $("fCity").insertAdjacentHTML("beforeend", `<option value="${esc(c)}">${esc(c)}</option>`);
  });
}

function render(){
  const city = $("fCity").value, type = $("fType").value, max = +$("fBudget").value;
  const list = PROPERTIES.filter(p =>
    (city === "all" || p.city === city) && (type === "all" || p.type === type) && (!max || p.lakhs <= max));
  $("count").textContent = lang === "ta" ? `${list.length} சொத்துகள் கிடைக்கின்றன` : `${list.length} properties found`;
  $("grid").innerHTML = list.length ? list.map(p => `
    <article class="card">
      <div class="thumb ${p.type}">${TYPE_LABEL[p.type]} · ${esc(p.city)}</div>
      <div class="body">
        <h3>${esc(p.title)}</h3>
        <p class="price">${price(p.lakhs)}</p>
        <p class="meta">${esc(p.size)} · ${esc(p.note)}</p>
        <a class="enq" target="_blank" rel="noopener"
           href="${wa(`Hi, I am interested in: ${p.title}, ${p.city} (${price(p.lakhs)})`)}">
           ${lang === "ta" ? "விவரம் கேட்க" : "Ask about this property"}</a>
      </div>
    </article>`).join("")
    : `<p>${lang === "ta" ? "பொருந்தும் சொத்து இல்லை. வடிகட்டிகளை மாற்றுங்கள்." : "No match. Try a wider budget or another city."}</p>`;
}

function setLang(l){
  lang = l;
  document.documentElement.lang = l;
  document.querySelectorAll("[data-en]").forEach(el => el.textContent = el.dataset[l]);
  $("langBtn").textContent = l === "en" ? "தமிழ்" : "English";
  render();
}

$("filters").addEventListener("input", render);
$("langBtn").addEventListener("click", () => setLang(lang === "en" ? "ta" : "en"));

$("enquiry").addEventListener("submit", e => {
  e.preventDefault();
  const name = $("qName").value.trim(), phone = $("qPhone").value.trim(), msg = $("qMsg").value.trim();
  const err = $("formErr");
  if (!name || !/^[0-9+\s-]{10,15}$/.test(phone)) {
    err.textContent = "Enter your name and a valid phone number.";
    err.hidden = false; return;
  }
  err.hidden = true;
  window.open(wa(`Name: ${name}\nPhone: ${phone}\nRequirement: ${msg || "Please call me"}`), "_blank", "noopener");
});

fillCities();
render();