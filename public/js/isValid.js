export function isValidUsername(name) {
  console.log('Check username ...');

  if (name.length < 4) {
    return [true, 'The name is to short'];
  } else if (name.length > 40) {
    return [true, 'Thename is too long'];
  }
  return [false, '<br>'];
}

export function isValidEmail(address) {
  console.log('Check e-mail address ...');
  if (address.length < 10) {
    return [true, 'The address is to short'];
  }
  return [false, '<br>'];
}

export function isValidPassword(pswd) {
  console.log('Check password ...');
  if (pswd.length < 12) {
    return [true, 'The password is to short'];
  } else if (pswd.length > 30) {
    return [true, 'The password is too long'];
  }
  return [false, '<br>'];
}
