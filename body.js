const toggle_btn = document.querySelector("#toggle_button");
const toggle_region = document.querySelector(".search");

function clickHandler() {
  const current_status = toggle_region.style.display;

  if (current_status === 'none') {
    toggle_region.style.display = 'flex';
  }
  else {
    toggle_region.style.display = 'none';
  }
}

toggle_btn.addEventListener("click", clickHandler)