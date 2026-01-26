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
  countries.length > 0
    ? countries.forEach((country) => {
        countriesContainer.innerHTML += `<div class="country">
        <h2>${country.country} - ${country.capital}</h2>
        <p>${country.population}</p>
         <button onclick="editCountry('${country.id}')">Edit</button>
        <button onclick="deleteCountry('${country.id}')">Delete</button>
      </div>`;
      })
    : (countriesContainer.innerHTML =
        '<p class="dataNotFoundText">Melumat tapilmadi !</p>');
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
            getToast("Melumat ugurla silindi !");
            getAllcountries();
          }
        })
        .catch((err) => {
          getToast(err.message, "error");
        });
    }
  });
};

const setFormVisibility = (isVisible) => {
  const addNewbtn = document.getElementById("addNewBtn");
  const countryName = document.getElementById("countryName");
  const addNewCountryForm = document.getElementById("addNewCountryForm");
  if (isVisible) {
    addNewCountryForm.style.display = "flex";
    addNewbtn.innerHTML = "Menyunu bagla";
    countryName.focus();
  } else {
    addNewCountryForm.style.display = "none";
    addNewbtn.innerHTML = "Menyunu ac";
  }
};

const editCountry = (id) => {
  isShowForm = true;
  setFormVisibility(isShowForm);
  mode = "edit";
  editingId = id;

  axios.get(endpoint + "/countries/" + id).then((res) => {
    if (res.status === 200 && res.statusText === "OK") {
      const countryName = document.getElementById("countryName");
      const countryCapital = document.getElementById("countryCapital");
      const submitBtn = document.getElementById("submitBtn");
      const countryPopulation = document.getElementById("countryPopulation");

      submitBtn.value = "Yenile";
      countryName.value = res.data.country;
      countryCapital.value = res.data.capital;
      countryPopulation.value = res.data.population;
    }
  });
};

// ====================================================================
getAllcountries();

const searchInput = document.getElementById("searchInput");

searchInput.oninput = (e) => {
  const filteredData = countries.filter(
    (p) =>
      p.country.toLowerCase().includes(e.target.value.toLowerCase()) ||
      p.capital.toLowerCase().includes(e.target.value.toLowerCase()),
  );
  showALLcountries(filteredData);
};

let mode = "create";
let editingId = null;
let isShowForm = false;
const addNewBtn = document.getElementById("addNewBtn");
const addNewCountryForm = document.getElementById("addNewCountryForm");
setFormVisibility(isShowForm);

addNewBtn.onclick = () => {
  isShowForm = !isShowForm;
  setFormVisibility(isShowForm);
};

addNewCountryForm.onsubmit = (e) => {
  e.preventDefault();

  const countryName = document.getElementById("countryName");
  const countryCapital = document.getElementById("countryCapital");
  const countryPopulation = document.getElementById("countryPopulation");

  const data = {
    country: countryName.value,
    capital: countryCapital.value,
    population: Number(countryPopulation.value),
  };

  if (mode === "create") {
    if (data.country && data.capital && countryPopulation.value.trim() !== "") {
      axios.post(endpoint + "/countries", data).then((res) => {
        if (res.status === 201 && res.statusText === "Created") {
          getToast("Olke ugurla yaradildi !");
          countryName.value = "";
          countryName.focus();
          countryCapital.value = "";
          countryPopulation.value = "";
          getAllcountries();
        }
      });
    } else {
      getToast("Butun xanalari doldurun!", "error");
    }
  } else {
    axios.put(endpoint + "/countries/" + editingId, data).then((res) => {
      if (res.status === 200 && res.statusText === "OK") {
        getToast("Olke ugurla yenilendi !");
        countryName.value = "";
        countryCapital.value = "";
        countryPopulation.value = "";
        getAllcountries();
        mode = "create";
        editingId = null;
        isShowForm = false;
        setFormVisibility(isShowForm);

        document.getElementById("submitBtn").value = "Elave et";
      }
    });
  }
};

const cancelBtn = document.getElementById("cancelBtn");

cancelBtn.onclick = () => {
  const countryName = document.getElementById("countryName");
  const countryCapital = document.getElementById("countryCapital");
  const countryPopulation = document.getElementById("countryPopulation");

  countryName.value = "";
  countryCapital.value = "";
  countryPopulation.value = "";
  getAllcountries();
  mode = "create";
  editingId = null;
  isShowForm = false;
  setFormVisibility(isShowForm);

  document.getElementById("submitBtn").value = "Əlavə et";
};
