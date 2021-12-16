class UserController {

    constructor(formIdCreate, formIdUpdate, tableId) {

        this.formEl = document.getElementById(formIdCreate);
        this.formElUpdate = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);

        this.submit();
        this.onEdit();
    }

    onEdit() {
        document.querySelector('.btn-cancel').addEventListener('click', e => {


            this.showPanelCreate();

        });

        this.formElUpdate.addEventListener('submit', event => {

            event.preventDefault();

            let btn = this.formElUpdate.querySelector('[type=submit]');

            btn.disabled = true;

            var values = this.getValues(this.formElUpdate);

            const trDinamica = document.querySelector('.tr-dinamica');

            this.getPhoto(this.formElUpdate).then(
                (content) => {
                    values.photo = content;
                    trDinamica.innerHTML =
                        `<tr ${(values.admin)? 'admin="true"':''} class="tr-users">                             
                            <td><img src="${values.photo}" alt="User Image" class="img-circle img-sm"></td>
                            <td>${values.name}</td>
                            <td>${values.email}</td>
                            <td>${(values.admin)? 'sim':'Não'}</td>
                            <td>${values.register.toLocaleDateString('pt-br')} - ${values.register.toLocaleTimeString('pt-br')}</td>
                            <td>
                                <button type="button" class="btn btn-edit btn-primary btn-xs btn-flat">Editar</button>
                                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                            </td>
                        </tr>`;

                    this.botaoEditar(values); //a informaçao desse usario a ser editado vem aqui

                    this.updateCount();

                    [...this.tableEl.children].forEach(tr => {
                        if (tr.classList.contains('tr-dinamica')) tr.classList.remove('tr-dinamica');
                    });

                    this.formElUpdate.reset();

                    btn.disabled = false;
                },
                (e) => {
                    console.log(e)
                }
            )

            this.showPanelCreate();

        })
    }

    submit() {


        this.formEl.addEventListener('submit', (event) => {

            event.preventDefault();

            let btn = this.formEl.querySelector('[type=submit]');

            btn.disabled = true;

            var values = this.getValues(this.formEl);

            if (!values) {
                btn.disabled = false;
                return false;
            }

            this.getPhoto(this.formEl).then(
                (content) => {
                    values.photo = content;

                    this.addLine(values); // o parametro de addLine, agora sao os valores de getValue que foram de user, definidos para classe User.

                    this.formEl.reset();

                    btn.disabled = false;
                },
                (e) => {
                    console.log(e)
                }
            )



        })
    }

    getPhoto(form) {

        return new Promise((resolve, reject) => {

            let fileReader = new FileReader();

            let elements = [...form.elements].filter(formItem => {

                if (formItem.name === 'photo') {
                    return formItem;
                }
            })

            let file = elements[0].files[0]; //depois de ter selecionado o input do arquivo, para pegar o arquivo tem que ser escrito assim


            fileReader.onload = () => { //onload é para esperar a foto carregar
                //ESSE FUNCAO é um callBack, so fazer isso depois que a imagem carregar
                resolve(fileReader.result)
            };

            fileReader.onerror = (e) => {

                reject(e);
            }

            if (file) {
                fileReader.readAsDataURL(file)
            } else {
                resolve('dist/img/boxed-bg.jpg');
            }

        })

    }

    getValues(form) {

        let user = {};
        let isValid = true;

        var spread = [...form.elements];

        spread.forEach((formItem, index) => {

            if (['name', 'email', 'password'].indexOf(formItem.name) > -1 && !formItem.value) {

                formItem.parentElement.classList.add('has-error');
                isValid = false;
            }

            if (formItem.name == 'gender') {
                if (formItem.checked) {

                    user[formItem.name] = formItem.value;

                }
            } else if (formItem.name == 'admin') {

                user[formItem.name] = formItem.checked;

            } else {
                user[formItem.name] = formItem.value;

            }



        });

        if (!isValid) {
            return false;
        }

        return new User( //aqui estamos pegando o todos os valores do user pego com forEach e colocando na classe
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin,
            //obs: esses sao os parametros que estamos passando, e eles tem que estar na mesma ordem da classe
        );

    }

    addLine(dataUser) {
        //addLine pegou la em cima em submit() o valor retornado como classe User por meio de getValues
        //console.log('dataUser:', dataUser);

        this.tableEl.innerHTML += ` 
        <tr ${(dataUser.admin)? 'admin="true"':''} class="tr-users">
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin)? 'sim':'Não'}</td>
            <td>${dataUser.register.toLocaleDateString('pt-br')} - ${dataUser.register.toLocaleTimeString('pt-br')}</td>
            <td>
                <button type="button" class="btn btn-edit btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        </tr>`;
        this.botaoEditar(dataUser);
        this.updateCount();
    }

    botaoEditar(dataUser) {

        [...this.tableEl.children].forEach(tr => {

            tr.querySelector('.btn-edit').addEventListener('click', e => {

                [...this.tableEl.children].forEach(tr => {
                    if (tr.classList.contains('tr-dinamica')) tr.classList.remove('tr-dinamica')
                });

                tr.classList.add('tr-dinamica');

                let form = document.querySelector('#form-user-update');

                for (let indice in dataUser) {

                    let campo = form.querySelector('[name=' + indice + ']'); //ache campos com o mesmo indice ex name=name, name=email 

                    if (campo) {

                        switch (campo.type) {
                            case 'file':
                                continue;
                                break;

                            case 'radio':
                                campo = form.querySelector('[name=' + indice + '][value=' + dataUser[indice] + ']');
                                campo.checked = true;
                                break;

                            case 'checkbox':
                                campo.checked = dataUser[indice];
                                break;

                            default:
                                campo.value = dataUser[indice];

                        }


                    }


                }

                this.showPanelUpdate();

            })
        });
    }

    showPanelCreate() {
        document.querySelector('#box-user-create').style.display = 'block';
        document.querySelector('#box-user-update').style.display = 'none';
    }

    showPanelUpdate() {
        document.querySelector('#box-user-create').style.display = 'none';
        document.querySelector('#box-user-update').style.display = 'block';
    }

    updateCount() {

        let numberUsers = 0;
        let numberAdmin = 0;

        [...this.tableEl.children].forEach(tr => {

            numberUsers++;

            let attAdm = tr.getAttribute('admin');

            if (attAdm) {
                numberAdmin++;
            }

        })

        document.querySelector('#number-users').innerHTML = numberUsers;
        document.querySelector('#number-admin').innerHTML = numberAdmin;
    }
}