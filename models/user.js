class User {

    constructor(name, gender, birth, country, email, password, photo, admin) {

        this.name = name;
        this.gender = gender;
        this.birth = birth;
        this.email = email;
        this.password = password;
        this.admin = admin;
        this.photo = photo;
        this.country = country;
        this.register = new Date();
    }

}