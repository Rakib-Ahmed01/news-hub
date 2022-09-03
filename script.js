console.log("Bismillah...");

const categories = document.getElementById("categories");
const newsContainer = document.getElementById("news-container");
const category = document.getElementById("category");
const newsCount = document.getElementById("news-count");
const modal = document.getElementById("modal");
const spinner = document.getElementById("spinner");
const noNews = document.getElementById("no-news");
const someThingWentWrong = document.getElementById("something-went-wrong");

const loadCategories = async () => {
  hide(noNews);
  display(spinner);
  try {
    const res = await fetch(
      "https://openapi.programming-hero.com/api/news/categories"
    );
    const data = await res.json();
    displayCategories(data);
  } catch (err) {
    const res = await fetch(
      "https://openapi.programming-hero.com/api/news/categories"
    );
    const data = await res.json();
    displayCategories(data);
  }
  hide(spinner);
};

loadCategories();

const displayCategories = (data) => {
  data = data.data.news_category;
  data.forEach((category) => {
    const li = document.createElement("li");
    li.innerHTML = `
        <li class="cursor-pointer" onclick=loadNews('${category.category_id}')>${category.category_name}</li>
    `;
    categories.appendChild(li);
  });
};

const loadNews = async (id) => {
  hide(noNews);
  try {
    display(spinner);
    const res = await fetch(
      `https://openapi.programming-hero.com/api/news/category/${id}`
    );
    const data = await res.json();
    if (res.ok) {
      displayNews(data, id);
    }
  } catch (err) {
    display(someThingWentWrong);
  }
};

loadNews("08");

const displayNews = (data, categoryId) => {
  newsContainer.innerHTML = "";
  hide(spinner);
  data = data.data;
  if (data.length <= 0) {
    display(noNews);
    newsCount.innerText = 0;
    category.innerText = "Culture";
  } else {
    hide(noNews);
    const sortedData = data.sort(
      (obj1, obj2) => obj2.total_view - obj1.total_view
    );
    if (data.length !== 0) {
      newsCount.innerText = data.length;
      switch (categoryId) {
        case "01":
          category.innerText = "Breaking News";
          break;
        case "02":
          category.innerText = "Regular News";
          break;
        case "03":
          category.innerText = "International News";
          break;
        case "04":
          category.innerText = "Sports";
          break;
        case "05":
          category.innerText = "Entertainment";
          break;
        case "07":
          category.innerText = "Arts";
          break;
        case "08":
          category.innerText = "All News";
          break;
      }
    }
    sortedData.forEach((news) => {
      const div = document.createElement("div");
      div.classList.add(
        "p-3",
        "bg-white",
        "rounded-md",
        "lg:flex",
        "gap-8",
        "mb-6",
        "space-y-2"
      );

      div.innerHTML = `
        <img
        id="thumbnail"
        src="${news.thumbnail_url}"
        alt=""
        class="w-full h-88 md:w-[30rem] md:mx-auto  lg:w-72  bg-cover"
      />
      <div id="text" class="space-y-5">
        <h1 id="title" class="text-3xl font-semibold">
          ${news.title}
        </h1>
        <p id="details" class="leading-7 text-base text-ellipsis overflow-hidden h-28">
         ${news.details}
        </p>
        <div class="flex justify-between items-center pr-6 mt-5">
          <div id="author-details" class="flex flex-col justify-center sm:flex-row items-center gap-2">
            <img
              src="${news.author.img}"
              alt=""
              class="w-10 h-10 rounded-full"
            />
            <div class="text-center sm:text-left">
              <h3 id="name" class="font-semibold">${
                Boolean(news.author.name) ? news.author.name : "No Data Found"
              }</h3>
              <p id="date" class="font-medium">${
                Boolean(news.author.published_date)
                  ? news.author.published_date
                  : "No Data Found"
              }</p>
            </div>
          </div>
          <div id="view" class="flex flex-col sm:flex-row justify-center items-center gap-2">
            <i class="fa-regular fa-eye text-lg"></i>
            <h2 class="font-semibold">${
              news.total_view !== null && typeof news.total_view === "number"
                ? news.total_view
                : "No Data Found"
            }</h2>
          </div>
          <div id="ratings">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i
            ><i class="fa-solid fa-star-half-stroke"></i>
          </div>
          <div>
            <button id="details-btn" class="text-white bg-sky-500 px-6 py-2 rounded shadow border border-sky-500 shadow-sky-100/20" data-bs-toggle="modal"
            data-bs-target="#exampleModalLong" onclick="loadFullNews('${
              news._id
            }')">
             Read More
            </button>
          </div>
        </div>
      </div>

    `;
      newsContainer.appendChild(div);
    });
  }
};

const loadFullNews = async (newsId) => {
  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/news/${newsId}`
    );
    const data = await res.json();
    displayFullNewsOnModal(data);
  } catch (err) {
    display(someThingWentWrong);
  }
  hide(spinner);
};

const displayFullNewsOnModal = (data) => {
  data = data.data;
  modal.innerHTML = `
  <div
  class="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md"
>
  <h5
    class="text-xl font-semibold leading-normal text-gray-800"
    id="exampleModalLongLabel"
  >
    ${data[0].title}
  </h5>
  <button
    type="button"
    class="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
    data-bs-dismiss="modal"
    aria-label="Close"
  ></button>
</div>
<div class="modal-body relative p-4 space-y-4 mx-auto">
  <img src="${data[0].thumbnail_url}" class="w-full h-96 bg-cover" "/>
  <p>${data[0].details}</p>
</div>
  `;
};

function hide(element) {
  element.classList.remove("flex");
  element.classList.add("hidden");
}
function display(element) {
  element.classList.remove("hidden");
  element.classList.add("flex");
}

function redirect() {
  window.location.href = "./blog.html";
}
