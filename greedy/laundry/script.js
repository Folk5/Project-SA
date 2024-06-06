document.addEventListener("DOMContentLoaded", function () {
  const customerDataButton = document.getElementById("customerDataButton");
  const addCustomerButton = document.getElementById("addCustomerButton");
  const contentSection = document.getElementById("contentSection");

  function loadContent(url) {
      fetch(url)
          .then((response) => {
              if (!response.ok) {
                  throw new Error("Failed to fetch page");
              }
              return response.text();
          })
          .then((html) => {
              contentSection.innerHTML = html;
          })
          .catch((err) => console.error("Failed to fetch page:", err));
  }

  function showSection(section) {
      if (section === "customer-data") {
          loadContent("data-customer.html");
          customerDataButton.classList.add("bg-blue-500", "text-white");
          addCustomerButton.classList.remove("bg-blue-500", "text-white");
      } else if (section === "add-customer") {
          loadContent("add-customer.html");
          addCustomerButton.classList.add("bg-blue-500", "text-white");
          customerDataButton.classList.remove("bg-blue-500", "text-white");
      }
  }

  function getQueryParam(param) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
  }

  const section = getQueryParam("section") || "customer-data";
  showSection(section);

  customerDataButton.addEventListener("click", function () {
      showSection("customer-data");
      history.replaceState(null, "", "?section=customer-data");
  });

  addCustomerButton.addEventListener("click", function () {
      showSection("add-customer");
      history.replaceState(null, "", "?section=add-customer");
  });
});
