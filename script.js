console.log("Bismillah...");

const categories = document.getElementById("categories");

const loadCategories = async () => {
  const res = await fetch(
    "https://openapi.programming-hero.com/api/news/categories"
  );
  const data = await res.json();
  displayCategories(data);
};

loadCategories();

const displayCategories = (data) => {
  data = data.data.news_category;
  data.forEach((category) => {
    const li = document.createElement("li");
    li.innerHTML = `
        <li onclick=('${category.category_id}')>${category.category_name}</li>
    `;
    categories.appendChild(li);
  });
};
