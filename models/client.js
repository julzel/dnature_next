class Client {
  constructor(
    firstName = "",
    lastName = "",
    email = "",
    address = { direccion: '', provincia: '', canton: '' },
    contactPhoneNumber = "",
    pets = []
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.address = {
      direccion: '',
      provincia: '',
      canton: '',
      ...address,
    };
    this.contactPhoneNumber = contactPhoneNumber;
    this.pets = pets;
  }
}
export { Client };
