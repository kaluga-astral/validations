import { ErrorInfo } from './types';

export const OBJECT_TYPE_ERROR_INFO: ErrorInfo = {
  code: Symbol('object'),
  message: 'Не является объектом',
};

export const STRING_TYPE_ERROR_INFO: ErrorInfo = {
  code: Symbol('string'),
  message: 'Не является строкой',
};

export const REQUIRED_ERROR_INFO: ErrorInfo = {
  code: Symbol('required'),
  message: 'Обязательно',
};

/**
 * @description Код ошибки для кейса, когда какая-то часть объекта не валидна
 */
export const OBJECT_SHAPE_ERROR_CODE = Symbol('object-shape');
