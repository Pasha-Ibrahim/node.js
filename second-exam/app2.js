const endpoint = "http://localhost:3000";

let countries = [];

const getToast = (message, type = "success") => {
  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    style: {
      background:
        type === "success"
          ? "linear-gradient(to right, #00b09b, #96c93d)"
          : "linear-gradient(to right, #d21212, #460808)",
    },
  }).showToast();
};
const getAllcountries = () => {
  axios
    .get(endpoint + "/countries")
    .then((res) => {
      if (res.status === 200 && res.statusText === "OK") {
        countries = res.data;
        showALLcountries(countries);
      }
    })
    .catch((err) => {
      getToast(err.message, "error");
    });
};

const showALLcountries = (countries) => {
  const countriesContainer = document.getElementById("countriesContainer");
  countriesContainer.innerHTML = "";
  countries.forEach((country) => {
    countriesContainer.innerHTML += `<div class="country">
        <h2>${country.country} - ${country.capital}</h2>
        <p>${country.population}</p>
        <button>Edit</button>
        <button onClick="deleteCountry('${country.id}')">Delete</button>
      </div>`;
  });
};

const deleteCountry = (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      axios
        .delete(endpoint + `/countries/${id}`)
        .then((res) => {
          if (res.status === 200 && res.statusText === "OK") {
            getToast("melumat ugurla silindi !");
            getAllcountries();
          }
        })
        .catch((err) => {
          getToast(err.message, "error");
        });
    }
  });
};

getAllcountries();
