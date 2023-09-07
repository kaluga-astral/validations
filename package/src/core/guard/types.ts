export type GuardDefOptions<AddDefOptions extends Record<string, unknown>> =
  Partial<AddDefOptions> & {
    /**
     * @description Переопределяет дефолтное сообщения ошибки для required
     * @example string.define({ requiredMessage: 'ИНН не может быть пустым' })(inn())
     */
    requiredErrorMessage?: string;
    /**
     * @description Переопределяет сообщение об ошибке типа
     * @example string.define({ typeErrorMessage: 'ИНН не может быть числом' })(inn())
     */
    typeErrorMessage?: string;
    /**
     * @description Позволяет выключать проверку на required
     * @default false
     */
    isOptional?: boolean;
  };

export type GuardValue = unknown;
