(function(global) {

  'use strict';

  var lib = {};

  function isString(v) {
    return (v && (typeof v === 'string' || v instanceof String));
  }

  function isNumber(v) {
    return (v && (typeof v === 'number' || v instanceof Number));
  }

  /**
  * @desc Validate email address.
  *
  * @func email
  * @param {string} email - email address
  * @return {boolean} - is valid email
  *
  * @example
  * console.log(vali.email('foo.bar-5@qux.com')); // true
  * console.log(vali.email('foo+bar-5@qux.com')); // true
  * console.log(vali.email('foo&bar-5@qux.com')); // true
  * console.log(vali.email('foo...bar-5@qux.com')); // false
  */
  function email(v) {
    if (!isString(v)) return false;
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(v);
  }

  /**
  * @desc Validate date.
  *
  * @func birthdate
  * @param {string} - date
  * @return {boolean} - is valid date
  *
  * @example
  * console.log(vali.minAge((new Date(1996, 02, 20)), 18)); // true
  */
  function date(v) {
    if (!(v)) return false;
    // Regex format: DD/MM/YYYY | DD-MM-YYYY | DD.MM.YYYY
    var re = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
    return re.test(v);
  }

  /**
  * @desc Validate minimum age.
  *
  * @func minAge
  * @param {Date} birthDate - birthdate
  * @param {integer} minAge - minimum age
  * @return {boolean} - is valid age
  *
  * @example
  * console.log(vali.minAge((new Date(1996, 02, 20)), 18)); // true
  * console.log(vali.minAge((new Date(2002, 02, 20)), 18)); // false
  */
  function minAge(birthDate, minAge) {
    if (!(birthDate && minAge)) return false;
    if (!(birthDate instanceof Date)) return false;
    if (!(typeof minAge === 'number' || minAge instanceof Number)) return false;
    var tmpDate = new Date(birthDate.getFullYear() + minAge, birthDate.getMonth(), birthDate.getDate()).setMonth(birthDate.getMonth() - 1);
    return (tmpDate <= new Date());
  }

  /**
  * @desc Validate username. Can only contain letters, numbers, and underscores.
  *
  * @func username
  * @param {string} username - username
  * @return {boolean} - is valid username
  *
  * @example
  * console.log(vali.username('foobar')); // true
  * console.log(vali.username('foo_bar')); // true
  * console.log(vali.username('foo-bar')); // false
  * console.log(vali.username('foo.bar')); // false
  */
  function username(v) {
    var re = /^[a-zA-Z0-9_]+$/;
    return re.test(v);
  }

  /**
  * @desc Validate name. Can only contain letters, dashes, apostrophes, and spaces.
  *
  * @func name
  * @param {string} name - name
  * @return {boolean} - is valid name
  *
  * @example
  * console.log(vali.name('Foo')); // true
  * console.log(vali.name("Foo'o bar")); // true
  * console.log(vali.name('Foo*')); // false
  * console.log(vali.name('Foo1')); // false
  */
  function name(v) {
    if (!(v)) return false;
    var re = /^[a-zA-Z-' ]*$/;
    return re.test(v);
  }

  /**
  * @desc Validate U.S. zip code.
  *
  * @func zip
  * @alias postalCode
  * @param {integer|string} zip - U.S. zip code
  * @return {boolean} - is valid zip code
  *
  * @example
  * console.log(vali.zip(12345)); // true
  * console.log(vali.zip('12345-2453')); // true
  * console.log(vali.zip(123456789)); // false
  */
  function zip(v) {
    if (!(v)) return false;
    var re = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
    return re.test(v);
  }

  /**
  * @desc Validate coordinate point. Must be inbetween -190 and 190;
  *
  * @func coordinate
  * @alias coord
  * @param {float|string} coord - coordinate point
  * @return {boolean} - is valid coordinate
  *
  * @example
  * console.log(vali.coord(41.1029592)); // true
  * console.log(vali.coord(-104.8049363)); // true
  * console.log(vali.coord('13')); // false
  * console.log(vali.coord(-200.8049363)); // false
  */
  function coordinate(v) {
    if (!(v && (typeof v === 'number' || v instanceof Number))) return false;
    var re = /^(\-?(([0-9]{1}?[0-9]{1})|([1]{1}[0-8]{1}[0-9]{1})|([1]{1}[9]{1}[0]{1}))+(\.\d+)?)$/;
    return re.test(v);
  }
  /**
  * @desc Validate Social Security number.
  *
  * @func ssn
  * @param {string} coord - coordinate point
  * @return {boolean} - is valid coordinate
  *
  * @example
  * console.log(vali.coord(41.1029592)); // true
  * console.log(vali.coord(-104.8049363)); // true
  * console.log(vali.coord('13')); // false
  * console.log(vali.coord(-200.8049363)); // false
  */
  function ssn(v) {
    if (!(isNumber(v) || isString(v))) return false;
    var re = /^(?!219099999|078051120)(?!666|000|9\d{2})\d{3}(?!00)\d{2}(?!0{4})\d{4}$/;
    var reWithDash = /^(?!\b(\d)\1+-(\d)\1+-(\d)\1+\b)(?!123-45-6789|219-09-9999|078-05-1120)(?!666|000|9\d{2})\d{3}-(?!00)\d{2}-(?!0{4})\d{4}$/;
    return re.test(v) || reWithDash.test(v);
  }

  /**
  * @desc Add a custom validator.
  *
  * @func validator
  * @param {string} name - name of the validator.
  * @return {boolean} - if successfully added/updated
  *
  * @example
  * vali.validator('alpha', function(str) {
  *    return /^[a-zA-Z]+$/.test(str);
  * });
  *
  * console.log(vali.alpha('abc')); // true
  * console.log(vali.alpha(3)); // false
  * console.log(vali.alpha('adf453')); // false
  */
  function validator(name, fn) {
    if (!(typeof fn === 'function')) false;
    lib[name] = fn;
    return true;
  }

  lib.email = email;
  lib.minAge = minAge;
  lib.username = username;
  lib.name = name;
  lib.zip = lib.postalCode = zip;
  lib.coordinate = lib.coord = coordinate;
  lib.ssn = ssn;
  lib.validator = validator;

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = lib;
    }
    exports.vali = lib;
  } else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return lib;
    });
  } else {
    global.vali = lib;
  }
}).call(this);
