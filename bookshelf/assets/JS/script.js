document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });
    renderDataStorage();
});

function addBook() {
    const judulBuku = document.getElementById('judulBuku').value;
    const penulisBuku = document.getElementById('penulisBuku').value;
    const tahunTerbit = document.getElementById('tahunTerbit').value;
    const diBaca = document.getElementById('sedangDibaca').checked;
    const selesaiBaca = document.getElementById('selesaiDibaca').checked;

    const generatedID = generateID();
    const bukuObject = generatedBukuObject(generatedID, judulBuku, penulisBuku, tahunTerbit, diBaca, selesaiBaca);
    buku.push(bukuObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateID() {
    return +new Date();
}

function generatedBukuObject(id, judul, penulis, terbit, sedangDibaca, selesaiDibaca) {
    return {
        id,
        judul,
        penulis,
        terbit,
        sedangDibaca,
        selesaiDibaca
    }
}

const buku = [];
const RENDER_EVENT = 'render-buku';

document.addEventListener(RENDER_EVENT, function () {
    const koleksiBuku = document.getElementById('dataBuku');
    const bukuMasihDibaca = document.getElementById('inProgress');
    const bukuSelesaiDibaca = document.getElementById('completed');
    koleksiBuku.innerHTML = '';
    bukuMasihDibaca.innerHTML = '';
    bukuSelesaiDibaca.innerHTML = '';

    for (const itemBuku of buku){
        const elemenBuku = makeList(itemBuku);
        koleksiBuku.append(elemenBuku);
    }
    for (const itemBuku of buku) {
        const elemenBuku = makeList(itemBuku);
        if(itemBuku.sedangDibaca && !itemBuku.selesaiDibaca) {
            bukuMasihDibaca.append(elemenBuku);
        } else if(itemBuku.selesaiDibaca){
            bukuSelesaiDibaca.append(elemenBuku);
        }
    }
});

function makeList(bukuObject) {
    const judul = document.createElement('h2');
    judul.innerText = bukuObject.judul;

    const penulis = document.createElement('p');
    penulis.innerHTML = '<b>Penulis</b> : ' +bukuObject.penulis;

    const terbit = document.createElement('p');
    terbit.innerHTML = '<b>Tahun terbit</b> : ' +bukuObject.terbit;

    const textContainer = document.createElement('div');
    textContainer.append(judul, penulis, terbit);

    const container = document.createElement('div');
    container.append(textContainer);
    container.setAttribute('id', `buku-${bukuObject.id}`);
    container.setAttribute('class', 'koleksiBuku');

    if (bukuObject.selesaiDibaca) {
        const keterangan = document.createElement('p');
        keterangan.innerHTML = '<b>Keterangan</b> : Selesai dibaca';

        const masihDibaca = document.createElement('button');
        masihDibaca.classList.add('fa-brands');
        masihDibaca.classList.add('fa-readme');
        masihDibaca.setAttribute('title', 'Sedang dibaca');

        masihDibaca.addEventListener('click', function(){
            listMasihDibaca(bukuObject.id);
        })

        const trashButton = document.createElement('button');
        trashButton.classList.add('fa-solid');
        trashButton.classList.add('fa-xmark');
        trashButton.setAttribute('title','hapus dari daftar');
        trashButton.addEventListener('click', function () {
            hapusDariDaftar(bukuObject.id);
        });

        container.append(keterangan, masihDibaca, trashButton)
    } else if(bukuObject.sedangDibaca && !bukuObject.selesaiDibaca){
        const keterangan = document.createElement('p');
        keterangan.innerHTML = '<b>Keterangan</b> : Sedang dibaca';
        const checkButton = document.createElement('button');
        checkButton.classList.add('fa-solid');
        checkButton.classList.add('fa-check');
        checkButton.setAttribute('title', 'Selesai dibaca');

        checkButton.addEventListener('click', function () {
            sudahSelesaiDibaca(bukuObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('fa-solid');
        trashButton.classList.add('fa-xmark');
        trashButton.setAttribute('title','hapus dari daftar');
        trashButton.addEventListener('click', function () {
            hapusDariDaftar(bukuObject.id);
        });

        container.append(keterangan, checkButton, trashButton);
    } else if(!bukuObject.sedangDibaca && !bukuObject.sedangDibaca){
        const keterangan = document.createElement('p');
        keterangan.innerHTML = '<b>Keterangan</b> : Belum dibaca';
        const fowardButton = document.createElement('button');
        fowardButton.classList.add('fa-brands');
        fowardButton.classList.add('fa-readme');
        fowardButton.setAttribute('title', 'Sedang dibaca');

        fowardButton.addEventListener('click', function () {
            listMasihDibaca(bukuObject.id);
        });

        const checkButton = document.createElement('button');
        checkButton.classList.add('fa-solid');
        checkButton.classList.add('fa-check');
        checkButton.setAttribute('title', 'Selesai dibaca');

        checkButton.addEventListener('click', function () {
            sudahSelesaiDibaca(bukuObject.id);
        });
        const trashButton = document.createElement('button');
        trashButton.classList.add('fa-solid');
        trashButton.classList.add('fa-trash');
        trashButton.setAttribute('title','Hapus buku');
        trashButton.addEventListener('click', function () {
            hapusDariKoleksi(bukuObject.id);
        });

        container.append(keterangan, fowardButton, checkButton, trashButton);
    }
    return container;
}

function sudahSelesaiDibaca(bukuId) {
    const bukuTarget = findBuku(bukuId);

    if (bukuTarget == null) return;

    bukuTarget.selesaiDibaca = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBuku(bukuId) {
    for (const itemBuku of buku) {
        if (itemBuku.id === bukuId) {
            return itemBuku;
        }
    }
    return null;
}

function listMasihDibaca(bukuId) {
    const bukuTarget = findBuku(bukuId);

    if (bukuTarget == null) return;

    bukuTarget.selesaiDibaca = false;
    bukuTarget.sedangDibaca = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function hapusDariDaftar(bukuId) {
    const bukuTarget = findBuku(bukuId);

    if (bukuTarget == null) return;

    bukuTarget.selesaiDibaca = false;
    bukuTarget.sedangDibaca = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function hapusDariKoleksi(bukuId) {
    const bukuTarget = findBukuIndex(bukuId);

    if (bukuTarget === -1) return;

    buku.splice(bukuTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBukuIndex(bukuId) {
    for (const index in buku) {
        if (buku[index].id === bukuId) {
            return index;
        }
    }

    return -1;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(buku);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
    const snackbar = document.getElementById('snackbar');
    snackbar.className = 'show';
    setTimeout(function () {
        snackbar.className = snackbar.className.replace('show', '');
    }, 3000);
});

function getDataList() {
    if (isStorageExist) {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } else {
        return [];
    }
}

function renderDataStorage() {
    const dataList = getDataList();
    for (const data of dataList) {
        buku.push(data);
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

const cariDataBuku = document.getElementById('cariBukuKey');
cariDataBuku.addEventListener('keyup', function(){
    const input = document.getElementById('cariBukuKey');
    const filter = input.value.toLowerCase();
    const koleksi = document.getElementsByClassName('koleksiBuku');
    for(let i=0; i<koleksi.length; i++){
        if(!koleksi[i].innerHTML.toLowerCase().includes(filter)){
            koleksi[i].style.display="none";
        }else {
            koleksi[i].style.display="";
        }
    }
});