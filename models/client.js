class Client {
  constructor(
    firstName = "",
    lastName = "",
    email = "",
    address = {},
    contactPhoneNumber = "",
    pets = []
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.address = address;
    this.contactPhoneNumber = contactPhoneNumber;
    this.pets = pets;
  }
}
export { Client };
