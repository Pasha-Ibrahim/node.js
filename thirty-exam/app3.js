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
  Writers.length > 0
    ? Writers.forEach((writer) => {
        WritersContainer.innerHTML += `  <div class="writer">
        <h2>${writer.yazici_adi}-${writer.familiya}</h2>
        <p>${writer.eser}</p>
        <button onclick = "editWriter('${writer.id}')">Edit</button>
         <button onclick="deleteWrite('${writer.id}')">Delete</button>
      </div>`;
      })
    : (WritersContainer.innerHTML =
        '<p class="dataNotFoundText">Melumat tapilmadi !</p>');
};

const deleteWrite = (id) => {
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
  const WriterName = document.getElementById("writerName");
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
      const WriterName = document.getElementById("writerName");
      const WriterFamily = document.getElementById("writerFamily");
      const submitBtn = document.getElementById("submitBtn");
      const WriterWork = document.getElementById("writerWork");

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
  showALLWriters(filteredData);
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

  const WriterName = document.getElementById("writerName");
  const WriterFamily = document.getElementById("writerFamily");
  const WriterWork = document.getElementById("writerWork");

  const data = {
    yazici_adi: WriterName.value,
    familiya: WriterFamily.value,
    eser: WriterWork.value,
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
  const WriterName = document.getElementById("writerName");
  const WriterFamily = document.getElementById("writerFamily");
  const WriterWork = document.getElementById("writerWork");

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
