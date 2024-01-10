const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MjhhYzIzOGVmMTA2YjhmNGM2MGNlZjk2MjU5NWJjYiIsInN1YiI6IjY1OGU3OTNjZDdkY2QyMGQ2MGVhZjVjNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ISlfZIi8alvNiRWhBDbv27ZhCBfS-RadxHs-t4Fg0VA",
  },
};

const url = "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1";
const base_url = "https://image.tmdb.org/t/p/w500";

fetch(url, options)
  .then((res) => res.json())
  .then((data) => {
    for (let i = 0; i < data["results"]["length"]; i++) {
      let title = data["results"][i]["title"];

      let overview = data["results"][i]["overview"];
      let overviewWordArray = overview.split(" ");

      if (overviewWordArray.length > 40) {
        let overviewProcessing = overview.split(" ", 40);
        str = overviewProcessing.join(" ");
        overview = str.concat(" (...)");
      }

      let poster = data["results"][i]["poster_path"];
      let voteRate = data["results"][i]["vote_average"];

      let temp_html = `
      <div class="content_${i}" id="card_${i}" style="grid-area: d${i};">
        <div class="movie_title">${title}</div>
        <div class="movie_overview">${overview}</div>
        <div class="movie_title">${voteRate}</div>
        <a href="info.html">
          <img src="${base_url}${poster}" alt="Poster [${title}]" style="width: 100%;">
        </a>
      </div>
      `;
      let element = document.querySelector("#value");

      element.insertAdjacentHTML("beforeend", temp_html);
    }
  });

function showModal(base_url, poster, title, idNum) {
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

  let textElement1 = document.createElement("p");
  textElement1.textContent = `${idNum} → ${title}`;

  modalContent.appendChild(image);
  modalContent.appendChild(textElement1);

  modal.appendChild(modalContent);
  modal.addEventListener("click", () => {
    modal.remove();
  });

  document.body.appendChild(modal);
  setTimeout(() => modal.classList.remove("hidden"), 0);
}

function searchHandler() {
  let node_list = document.getElementsByName("searchCond");
  let keyword = document.getElementById("search_input").value;
  let searchCond = "empty";
  
  node_list.forEach((node) => {
    if (node.checked) {
      searchCond = node.value;
      if (searchCond === "title") {
        fetch(url, options)
          .then((res) => res.json())
          .then((data) => {
            let checker = false;

            for (let i = 0; i < data["results"]["length"]; i++) {
              let idNum = data["results"][i]["id"];
              let title = data["results"][i]["title"];
              let titleWordArray = title.split(" ");
              let result = titleWordArray.find(function (t) {
                return t === keyword;
              });

              let poster = data["results"][i]["poster_path"];

              if (result) {
                showModal(base_url, poster, title, idNum);
                checker = true;
              } 
            }

            if (!checker) {alert("검색 결과가 없습니다.");}
          });
      } else if (searchCond === "content") {
        fetch(url, options)
          .then((res) => res.json())
          .then((data) => {
            let checker = false;
            
            for (let i = 0; i < data["results"]["length"]; i++) {
              let idNum = data["results"][i]["id"];
              let title = data["results"][i]["title"];
              let overview = data["results"][i]["overview"];
              let overviewWordArray = overview.split(" ");
              let result = overviewWordArray.find(function (t) {
                return t === keyword;
              });

              let poster = data["results"][i]["poster_path"];

              if (result) {
                showModal(base_url, poster, title, idNum);
                checker = true;
              } 
            }

            if (!checker) {alert("검색 결과가 없습니다.");}
          });
      }
    }
  });

  if (searchCond === "empty") {
    alert("검색 조건을 선택하세요.");
  }
}
