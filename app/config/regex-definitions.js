const regex = {
  POSTCODE: /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([AZa-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]))))?[0-9][A-Za-z]{2})$/i,
  YEAR: /^[12]\d{3}$/,
  NUMBER_REGEX: /^\d*$/,
  NUMBER_TWO_DECIMAL_REGEX: /^\d*(\.\d{1,2})?$/,
  NUMBER_ONE_DECIMAL_REGEX: /^\d*(\.\d)?$/,
  DECIMAL_REGEX: /^\d+\.\d{1,}$/,
  DECIMAL_TEST_CURRENCY: /[.,]\d{1,2}$/,
  DECIMAL_MATCH: /^(.*?)([.,])(\d{1,2})$/,
  MORE_THAN_ONE_DECIMAL_REGEX: /^\d+\.\d{2,}$/,
  MORE_THAN_TWO_DECIMAL_REGEX: /^\d+\.\d{3,}$/,
  UPRN: /^\d{1,12}$/,
  ROLL_NUMBER_CHARS: /^[\dA-Za-z.\\/ -]*$/,
  CURRENCY: /^(?:\d{1,3}(?:,\d{3})+|\d+)?([.,]\d{0,2})?$(\.|,)?/g,
  NON_NUMERIC: /[a-zA-Z!@٣٣£$%^&*()_?><,{}[~`'":;=|\\/+\-\][]/,
  PHONE_NUMBER: /^[0-9 +()-]+$/,
  NAME: /^[\\sa-zA-Z' -]*$/,
  MATCH_NON_DIGITS: /[^0-9]/g,
  EMAIL:/^[a-zA-Z0-9.!#$%&'*+=?^_`{|}~\\/-]+@(?=[^.@][^@\s]+)[a-zA-Z0-9.&'-]+\.[a-zA-Z]{2,}$/,
  SPECIAL_CHARACTERS: /[^A-Za-z0-9]/,
  REJECT_ZERO_VALUES: /^(?!0+(?:[,.]?0{1,2})?$)(?:\d{1,3}(?:,\d{3})+|\d+)?(?:[.,]\d{1,2})?$/,
  COMMA: /,/g
};

module.exports = regex;
