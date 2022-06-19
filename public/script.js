document.forms['contactForm'].addEventListener('submit', e => {
    e.preventDefault();
    let form = document.forms['contactForm'];
    let name = form.elements['name'].value;
    let tel = form.elements['tel'].value;
    let marked = form.elements['marked'].checked;
    if (name === '' || tel === '') {
        document.getElementById('alert').style.display = 'block';
    } else {
        createContact(name, tel, marked);
        form.elements['name'].value = form.elements['tel'].value = '';
        document.getElementById('alert').style.display = 'none';
    }
})

async function getContacts() {
    cardsContainer.style.display = 'none';
    document.querySelector('.spinner-border').style.display = 'block';
    const response = await fetch('/api/contacts', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });
    if (response.ok === true) {
        document.querySelector('.spinner-border').style.display = 'none';
        cardsContainer.style.display = 'flex';

        const contacts = await response.json();
        console.log(contacts);
        if (!contacts.length) {
            no_contacts_info.style.display = 'block';
        } else {
            contacts.forEach(contact => addCard(contact));
        }
    }
}

async function createContact(name, tel, marked) {
    const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            tel: tel,
            marked: marked
        })
    })
    if (response.ok === true) {
        no_contacts_info.style.display = 'none';

        const contact = await response.json();
        addCard(contact);
    }
}

async function markContact(id) {
    const contact = document.querySelector(`div[data-card-id='${id}']`);
    let marked = contact.classList.contains('border-primary') ? true : false;
    const response = await fetch(`/api/contacts`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            marked: !marked
        })
    })
    if (response.ok === true) {
        const updatedContact = await response.json();
        document.querySelector(`div[data-card-id='${updatedContact.id}']`).classList.toggle('border-primary');
    }
}

async function deleteContact(id) {
    const response = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json'
        }
    });
    if (response.ok === true) {
        const contact = await response.json();
        let card = document.querySelector(`div[data-card-id='${contact.id}']`);
        card.parentElement.remove();
    }
    const response2 = await fetch('/api/contacts', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });
    if (response2.ok === true) {
        const contacts = await response2.json();
        if (!contacts.length) {
            no_contacts_info.style.display = 'block';
        }
    }
}

function addCard(contact) {
    const div = document.createElement('div');
    div.classList.add('col-sm-6', 'mb-3');
    div.style.padding = 0;
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('data-card-id', contact.id);
    card.style.maxWidth = '96%';
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.innerText = contact.name;
    const tel = document.createElement('p');
    tel.classList.add('card-text');
    tel.innerText = contact.tel;
    const markBtn = document.createElement('a');
    markBtn.classList.add('btn', 'btn-primary', 'me-3');
    markBtn.innerText = 'Mark';
    markBtn.addEventListener('click', e => {
        e.preventDefault();
        markContact(contact.id);
    })
    const deleteBtn = document.createElement('a');
    deleteBtn.classList.add('btn', 'btn-secondary');
    deleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        deleteContact(contact.id);
    })
    deleteBtn.innerText = 'Delete';
    if (contact.marked) {
        card.classList.add('border-primary');
    }
    cardBody.append(cardTitle);
    cardBody.append(tel);
    cardBody.append(markBtn);
    cardBody.append(deleteBtn);
    card.append(cardBody);
    div.append(card);
    cardsContainer.append(div);
}

getContacts();