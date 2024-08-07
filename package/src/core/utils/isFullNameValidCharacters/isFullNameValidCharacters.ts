/**
 * Проверяет, что разрешенные символы в тексте: прописные (большие) и строчные буквы (включая ё) русского алфавита,
      прописные (большие) буквы I и V латинского алфавита, -, пробел, точка, апостроф, запятая, открывающая и закрывающая скобка
 */
export const isFullNameValidCharacters = (value: string): boolean =>
  !/^([а-яёА-ЯЁIV ё.,'’‎()\-\s]+)$/.test(value);
