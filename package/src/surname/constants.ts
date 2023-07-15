import { ErrorInfo, createErrorCode } from '../core';

export const LENGTH_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('length'),
  message: 'Фамилия может содержать от 1 до 200 символов',
};

export const ALPHANUM_SURNAME_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('alphanum'),
  message:
    "Фамилия может содержать только буквы русского алфавита, буквы I, V латинского алфавита и следующие спецсимволы: -;  ; .; '; ,; (; );",
};

export const LETTER_BEGINNING_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('letter-beginning'),
  message: 'Фамилия должна начинаться с заглавной буквы либо апострофа',
};

export const DOUBLE_SYMBOL_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('double-symbol'),
  message: 'Фамилия не может содержать два подряд спецсимвола',
};

export const LETTER_ENDING_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('letter-ending'),
  message: 'Фамилия должна оканчиваться строчной буквой',
};

export const RESTRICTED_VALUES = [];
