const form = document.querySelector('#form-rehber');
const contactsList = document.querySelector('.rehber-listesi');
const nameInput = document.querySelector('.ad-input');
const surnameInput = document.querySelector('.soyad-input');
const emailInput = document.querySelector('.email-input');
const saveButton = document.querySelector('#kaydet-button');
const alertBox = document.querySelector('#alert-box');
let selectedTr = undefined;

controlLocaStorage();
reloadContacts();

contactsList.addEventListener('click', eventEditRemove);
form.addEventListener('submit', addContacts);

// Addition section
function addContacts(e) { //person ekliyoruz
    //3 farklı variable açmak yerine array destructuring kullandık
    const [name, surname, email] = [
        nameInput.value,
        surnameInput.value,
        emailInput.value];

    // boşmu değilmi kontrol ettik
    if (name && surname && email) {
        if(e.target.children[e.target.children.length - 1].id == 'güncelle-button'){
            saveButton.setAttribute('value','Kaydet');
            saveButton.setAttribute('id','kaydet-button');
            let contacts = JSON.parse(localStorage.getItem('contacts'));
            let person = new createPerson(name, surname, email);
            let index = contacts.findIndex((e) => e.name == selectedTr.cells[0].textContent && e.surname == selectedTr.cells[1].textContent && e.email == selectedTr.cells[2].textContent);
            contacts[index].name = person.name;
            contacts[index].surname = person.surname;
            contacts[index].email = person.email;
            localStorage.setItem('contacts', JSON.stringify(contacts));
            selectedTr.cells[0].textContent = person.name;
            selectedTr.cells[1].textContent = person.surname;
            selectedTr.cells[2].textContent = person.email;
            createAlert('güncellendi')
        } else {
            let person = new createPerson(name, surname, email);
            let controlResult = personControl(person);
            if (!controlResult) {
                addStorage(person);
                createItem(person);
                createAlert('eklendi');
            } else { createAlert('aynı bilgi') }}
    } else { createAlert('alan boş') }

    nameInput.value = "";
    surnameInput.value = "";
    emailInput.value = "";
}

//section adding contact to repository
function addStorage(person) { //local kısmına person ekliyoruz.
    //eğer local kısmında 'contacts' yerimiz eksik ise oluşturuyoruz.
    controlLocaStorage();

    let controlResult = personControl(person);

    let contacts = JSON.parse(localStorage.getItem('contacts'));
    contacts.push(person);
    localStorage.setItem('contacts', JSON.stringify(contacts));
}

// contact creation section
function createPerson(name, surname, email) {//person nesnesi oluşturuyoruz.
    this.name = name;
    this.surname = surname;
    this.email = email;
}

//the part of editing and deleting contacts
function eventEditRemove(e) {
    if(e.target.classList.contains('edit-button')){
        saveButton.setAttribute('value','Güncelle');
        saveButton.setAttribute('id','güncelle-button');
        let tdBtn = e.target.parentElement.parentElement;
        let [name,surname,email] = [
            tdBtn.previousSibling.previousSibling.previousSibling.textContent,
            tdBtn.previousSibling.previousSibling.textContent,
            tdBtn.previousSibling.textContent
        ];
        nameInput.value = name;
        surnameInput.value = surname;
        emailInput.value = email;
        selectedTr = e.target.parentElement.parentElement.parentElement;
    }
    else if(e.target.classList.contains('remove-button')){
        let tdBtn = e.target.parentElement.parentElement;
        let [name,surname,email] = [
            tdBtn.previousSibling.previousSibling.previousSibling.textContent,
            tdBtn.previousSibling.previousSibling.textContent,
            tdBtn.previousSibling.textContent
        ];
        let person = new createPerson(name,surname,email)
        removePersonStorage(person)
        e.target.parentElement.parentElement.parentElement.remove();
        createAlert('silindi');
    }
}

// structure creation section
function createItem(person) {
    let { name, surname, email } = person;

    const tr = document.createElement('tr');

    const [tdName, tdSurname, tdEmail, tdButtons] = [
        document.createElement('td'),
        document.createElement('td'),
        document.createElement('td'),
        document.createElement('td')
    ];
    tdName.textContent = name;
    tdSurname.textContent = surname;
    tdEmail.textContent = email;

    tdName.classList.add('name');
    tdSurname.classList.add('surname');
    tdEmail.classList.add('email');

    tdName.style.textAlign = 'center';
    tdSurname.style.textAlign = 'center';
    tdEmail.style.textAlign = 'center';
    tdButtons.style.textAlign = 'center';

    const [editButton, removeButton] = [
        document.createElement('button'),
        document.createElement('button')
    ]

    editButton.innerHTML = '<i class="fas fa-edit"></i>';
    editButton.classList.add('edit-button');
    editButton.classList.add('btn');
    editButton.classList.add('btn-success');

    removeButton.innerHTML = '<i class="fas fa-trash"></i>';
    removeButton.classList.add('remove-button');
    removeButton.classList.add('btn')
    removeButton.classList.add('btn-danger');

    const buttonDiv = document.createElement('div');
    buttonDiv.className = 'btn-group';

    buttonDiv.appendChild(editButton);
    buttonDiv.appendChild(removeButton);
    tdButtons.appendChild(buttonDiv)

    tr.appendChild(tdName);
    tr.appendChild(tdSurname);
    tr.appendChild(tdEmail);
    tr.appendChild(tdButtons);

    contactsList.appendChild(tr);
}

// person control section
function personControl(person) {
    //local kısmında bizim verdiğimiz değerler ve 'contacts' listesi
    //içerisinde bulunan değerleri kontrol ediyoruz.
    let contacts = JSON.parse(localStorage.getItem('contacts'));
    let control;
    for (let i = 0; i < contacts.length; i++) {
        let { name, surname, email } = contacts[i];
        let { name: pName, surname: pSurname, email: pEmail } = person;
        if (name == pName && surname == pSurname && email == pEmail) {
            control = true;
        } else {
            control = false;
        }
    }
    return control;
}

//warehouse control section
function controlLocaStorage() {
    if (localStorage.getItem('contacts') === null) {
        localStorage.setItem('contacts', JSON.stringify([]));
    }
}

//section to undo items when the page is refreshed
function reloadContacts() { //sayfa yenilendiği zaman tüm rehberi geri getir.
    let contacts = JSON.parse(localStorage.getItem('contacts'));

    if(contacts.length > 0){
        contacts.forEach((person) => {
            createItem(person);
        });
    }
}

//person removal section from the warehouse
function removePersonStorage(person) { 
    //kişiyi liste içinde bul ve kendisi hariç tüm kişileri bir diziye ata ve döndür kayıt et.
    let contacts = JSON.parse(localStorage.getItem('contacts'));
    let newContacts = contacts.filter(element => element.name != person.name && element.surname != person.surname && element.email != person.email);
    localStorage.setItem('contacts',JSON.stringify(newContacts));
}

//creating alerts section
function createAlert(alert){
    if(alert == 'alan boş'){
        alertBox.innerHTML = '<div class="alert alert-warning"><strong>Uyarı!</strong> Hiç bir alan boş bırakılamaz.</div>';
    }
    else if(alert == 'aynı bilgi'){
        alertBox.innerHTML = '<div class="alert alert-warning"><strong>Uyarı!</strong> Böyle bir kişi zaten var.</div>';
    }
    else if(alert == 'eklendi'){
        alertBox.innerHTML = '<div class="alert alert-success"><strong>Başarılı!</strong> Kişi başarılı bir şekilde eklendi </div>';
    }
    else if(alert == 'güncellendi'){
        alertBox.innerHTML = '<div class="alert alert-success"><strong>Başarılı!</strong>  Kişi başarılı bir şekilde güncellendi. </div>';
    }
    else if(alert == 'silindi'){
        alertBox.innerHTML = '<div class="alert alert-success"><strong>Başarılı!</strong>  Kişi başarılı bir şekilde silindi. </div>';
    }
    setTimeout(() => {
       document.querySelector('.alert').style.transition = 'all 0.8s';
       document.querySelector('.alert').style.opacity = '0';
       let alertThisBox = document.querySelector('.alert');
       setTimeout(() => alertThisBox.remove(),600);
    },4000);
}

