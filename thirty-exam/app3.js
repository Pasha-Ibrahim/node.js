const endpoint = "http://localhost:3000";
let Writers = [];
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
const getAllWriters = () => {
  axios
    .get(endpoint + "/Writers")
    .then((res) => {
      if (res.status === 200 && res.statusText === "OK") {
        Writers = res.data;
        showALLWriters(Writers);
      }
    })
    .catch((err) => {
      getToast(err.message, "error");
    });
};

const showALLWriters = (Writers) => {
  const WritersContainer = document.getElementById("WritersContainer");
  WritersContainer.innerHTML = "";
  Writers.forEach((write) => {
    WritersContainer.innerHTML += `  <div class="write">
        <h2>${write.yazici_adi}-${write.familiya}</h2>
        <p>${write.eser}</p>
        <button>Edit</button>
        <button>Delete</button>
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
        .delete(endpoint + `/Writers/${id}`)
        .then((res) => {
          if (res.status === 200 && res.statusText === "OK") {
            getToast("Melumat ugurla silindi !");
            getAllWriters();
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
  const WriterName = document.getElementById("WriterName");
  const addNewWriterForm = document.getElementById("addNewWriterForm");
  if (isVisible) {
    addNewWriterForm.style.display = "flex";
    addNewbtn.innerHTML = "Menyunu bagla";
    WriterName.focus();
  } else {
    addNewWriterForm.style.display = "none";
    addNewbtn.innerHTML = "Menyunu ac";
  }
};

const editWriter = (id) => {
  isShowForm = true;
  setFormVisibility(isShowForm);
  mode = "edit";
  editingId = id;

  axios.get(endpoint + "/Writers/" + id).then((res) => {
    if (res.status === 200 && res.statusText === "OK") {
      const WriterName = document.getElementById("WriterName");
      const WriterFamily = document.getElementById("WriterFamily");
      const submitBtn = document.getElementById("submitBtn");
      const WriterWork = document.getElementById("WriterWork");

      submitBtn.value = "Yenile";
      WriterName.value = res.data.yazici_adi;
      WriterFamily.value = res.data.familiya;
      WriterWork.value = res.data.eser;
    }
  });
};

// ====================================================================
getAllWriters();

const searchInput = document.getElementById("searchInput");

searchInput.oninput = (e) => {
  const filteredData = Writers.filter(
    (p) =>
      p.yazici_adi.toLowerCase().includes(e.target.value.toLowerCase()) ||
      p.familiya.toLowerCase().includes(e.target.value.toLowerCase()),
  );
  showALLcountries(filteredData);
};

let mode = "create";
let editingId = null;
let isShowForm = false;
const addNewBtn = document.getElementById("addNewBtn");
const addNewWriterForm = document.getElementById("addNewWriterForm");
setFormVisibility(isShowForm);

addNewBtn.onclick = () => {
  isShowForm = !isShowForm;
  setFormVisibility(isShowForm);
};

addNewWriterForm.onsubmit = (e) => {
  e.preventDefault();

  const WriterName = document.getElementById("WriterName");
  const WriterFamily = document.getElementById("WriterFamily");
  const WriterWork = document.getElementById("WriterWork");

  const data = {
    yazici_adi: WriterName.value,
    familiya: WriterFamily.value,
    eser: Number(WriterWork.value),
  };

  if (mode === "create") {
    if (data.yazici_adi && data.familiya && WriterWork.value.trim() !== "") {
      axios.post(endpoint + "/Writers", data).then((res) => {
        if (res.status === 201 && res.statusText === "Created") {
          getToast("eser ugurla yaradildi !");
          WriterName.value = "";
          WriterName.focus();
          WriterFamily.value = "";
          WriterWork.value = "";
          getAllWriters();
        }
      });
    } else {
      getToast("Butun xanalari doldurun!", "error");
    }
  } else {
    axios.put(endpoint + "/Writers/" + editingId, data).then((res) => {
      if (res.status === 200 && res.statusText === "OK") {
        getToast("eser ugurla yenilendi !");
        WriterName.value = "";
        WriterFamily.value = "";
        WriterWork.value = "";
        getAllWriters();
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
  const WriterName = document.getElementById("WriterName");
  const WriterFamily = document.getElementById("WriterFamily");
  const WriterWork = document.getElementById("WriterWork");

  WriterName.value = "";
  WriterFamily.value = "";
  WriterWork.value = "";
  getAllWriters();
  mode = "create";
  editingId = null;
  isShowForm = false;
  setFormVisibility(isShowForm);

  document.getElementById("submitBtn").value = "Əlavə et";
};
