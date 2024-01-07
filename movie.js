const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MjhhYzIzOGVmMTA2YjhmNGM2MGNlZjk2MjU5NWJjYiIsInN1YiI6IjY1OGU3OTNjZDdkY2QyMGQ2MGVhZjVjNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ISlfZIi8alvNiRWhBDbv27ZhCBfS-RadxHs-t4Fg0VA",
  },
};

let url = "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1";
let base_url = "https://image.tmdb.org/t/p/w500";

fetch(url, options)
  .then((res) => res.json())
  .then((data) => {
    for (let i = 0; i < data["results"]["length"]; i++) {
      let title = data["results"][i]["title"];
      let title_word_array = title.split(" ");

      let overview = data["results"][i]["overview"];
      let overview_word_array = overview.split(" ");

      if (overview_word_array.length > 40) {
        let overview_processing = overview.split(" ", 40);
        str = overview_processing.join(" ");
        overview = str.concat(" (...)");
      }

      let poster = data["results"][i]["poster_path"];
      let vote_rate = data["results"][i]["vote_average"];

      let temp_html = `
      <div class="content_${i}" id="card_${i}" style="grid-area: d${i};">
        <div class="movie_title">${title}</div>
        <div class="movie_overview">${overview}</div>
        <div class="movie_title">${vote_rate}</div>
        <a href="${base_url}${poster}" target="_blank">
          <img src="${base_url}${poster}" alt="Poster [${title}]" style="width: 100%;">
        </a>
      </div>
      `;
      let element = document.querySelector("#value");

      element.insertAdjacentHTML("beforeend", temp_html);
    }
  });

function showModal(base_url, poster, text, id_num) {
  let existingModal = document.querySelector(".modal");
  if (existingModal) {
    existingModal.remove();
  }

  let modal = document.createElement("div");
  modal.className = "modal hidden";

  let modalContent = document.createElement("div");
  modalContent.className = "modal-content zoomIn";

  let image = document.createElement("div");
  image.style.backgroundImage = `url(${base_url}${poster})`;
  image.alt = "Door Image";

  let textElement = document.createElement("p");
  textElement.textContent = `${id_num} → ${text}`;

  modalContent.appendChild(image);
  modalContent.appendChild(textElement);

  modal.appendChild(modalContent);
  modal.addEventListener("click", () => {
    modal.remove();
  });

  document.body.appendChild(modal);
  setTimeout(() => modal.classList.remove("hidden"), 0);
}

function searchHandler() {
  let node_list = document.getElementsByName("search_cond");
  let keyword = document.getElementById("search_input").value;
  let search_cond = "empty";

  node_list.forEach((node) => {
    if (node.checked) {
      search_cond = node.value;
      if (search_cond === "title") {
        fetch(url, options)
          .then((res) => res.json())
          .then((data) => {
            for (let i = 0; i < data["results"]["length"]; i++) {
              let id_num = data["results"][i]["id"];
              let title = data["results"][i]["title"];
              let title_word_array = title.split(" ");
              let result = title_word_array.find(function (t) {
                return t === keyword;
              });

              let poster = data["results"][i]["poster_path"];

              if (result) {
                showModal(base_url, poster, title, id_num);
              }
            }
          });
      } else if (search_cond === "content") {
        fetch(url, options)
          .then((res) => res.json())
          .then((data) => {
            for (let i = 0; i < data["results"]["length"]; i++) {
              let id_num = data["results"][i]["id"];
              let title = data["results"][i]["title"];
              let overview = data["results"][i]["overview"];
              let overview_word_array = overview.split(" ");
              let result = overview_word_array.find(function (t) {
                return t === keyword;
              });

              let poster = data["results"][i]["poster_path"];

              if (result) {
                showModal(base_url, poster, title, id_num);
              }
            }
          });
      }
    }
  });

  if (search_cond === "empty") {
    alert("검색 조건을 선택하세요.");
  }
}

