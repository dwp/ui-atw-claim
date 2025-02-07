const regex = {
  POSTCODE: /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([AZa-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]))))?[0-9][A-Za-z]{2})$/i,
  YEAR: /^[12]\d{3}$/,
  NUMBER_REGEX: /^\d*$/,
  NUMBER_TWO_DECIMAL_REGEX: /^\d*(\.\d{1,2})?$/,
  NUMBER_ONE_DECIMAL_REGEX: /^\d*(\.\d)?$/,
  DECIMAL_REGEX: /^\d+\.\d{1,}$/,
  MORE_THAN_ONE_DECIMAL_REGEX: /^\d+\.\d{2,}$/,
  MORE_THAN_TWO_DECIMAL_REGEX: /^\d+\.\d{3,}$/,
  UPRN: /^\d{1,12}$/,
  ROLL_NUMBER_CHARS: /^[\dA-Za-z.\\/ -]*$/,
  CURRENCY: /^(\d{1,8})(\.\d{0,2})?$/,
  NON_NUMERIC: /[a-zA-Z!@£$%^&*()_?><,{}[~`'":;=|\\/+\-\][]/,
  PHONE_NUMBER: /^[0-9 +()-]+$/,
  NAME: /^[\\sa-zA-Z' -]*$/,
  MATCH_NON_DIGITS: /[^0-9]/g,
  EMAIL:/^[a-zA-Z0-9.!#$%&'*+=?^_`{|}~\\/-]+@(?=[^.@][^@\s]+)[a-zA-Z0-9.&'-]+\.[a-zA-Z]{2,}$/,
  SPECIAL_CHARACTERS: /[^A-Za-z0-9]/,
};

module.exports = regex;
