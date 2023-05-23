# @astral/validations

Библиотека для валидаций в функциональном стиле.

Особенности:

- ⚡️️️️ Ориентирована на специфику frontend-приложений
- ⚡️️️️ Функциональный стиль
- ⚡️️️️ [Валидация по схеме](#object), а также использование правил валидации вне контекста схемы
- ⚡️️️️ Оптимизирована для валидации форм (есть [поддержка react-hook-form](#react-hook-form))
- ⚡️️️️ Полноценная поддержка tree shaking
- ⚡️️️️ Простота создания [кастомных правил валидации](#custom-rules)

# Table of contents

- [Installation](#installation)
- [Basic usage](#basic-usage)
- [Guards](#guards)
  - [number](#number)
    - [min](#min-number)
    - [max](#max-number)
  - [string](#string)
    - [min](#min-string)
    - [max](#max-string)
    - [email](#email)
    - [pattern](#pattern)
    - [onlyNumber](#onlyNumber)
    - [snils](#snils)
    - [mobilePhone](#mobilePhone)
    - [innUL](#innUL)
    - [innIP](#innIP)
    - [kpp](#kpp)
    - [ogrnIP](#ogrnIP)
    - [ogrnUL](#ogrnUL)
  - [date](#date)
    - [min](#min-date)
    - [max](#max-date)
  - [boolean](#boolean)
  - [object](#object)
    - [partial](#partial)
    - [deepPartial](#deepPartial)
  - [array](#array)
    - [arrayItem](#arrayItem)
    - [min](#min-array)
    - [max](#max-array)
  - [Define. Переопределение дефолтных параметров guard](#define-переопределение-дефолтных-параметров-guard)
- [Custom rules](#custom-rules)
  - [Базовый пример](#базовый-пример)
  - [Связанные поля и условная валидация](#связанные-поля-и-условная-валидация)
  - [Переиспользуемое правило](#переиспользуемое-правило)
- [Common](#common)
  - [optional](#optional)
  - [transform](#transform)
  - [or](#or)
- [Integrations](#integrations)
  - [react-hook-form](#react-hook-form)
- [Error message customization](#error-message-customization)
- [Exclusion managing](#exclusion-managing)
  
---

# Installation

```shell
npm i --save @astral/validations
```

```shell
yarn add @astral/validations
```

---

# Basic usage

Валидация объекта с вложенным массивом

```ts
import {
  object,
  array,
  arrayItem,
  string,
  optional,
  min,
  number
} from '@astral/validations';

type Permission = {
  id: number;
  description: string;
};

type User = {
  name: string;
  surname?: string;
  info: {
    permissions: Permission[];
  };
};

const validate = object<User>({
  name: string(),
  surname: optional(string()),
  info: object<User['info']>({
    permissions: array(
      arrayItem(
        object<Permission>({
          id: number(),
          description: string(min(2)),
        }),
      ),
    ),
  }),
});

// undefined
validate({
  name: 'Vasya',
  info: {
    permissions: [{ id: 1, description: 'my permission' }],
  },
});

// Error in info.permissions.0.description: Обязательно
validate({
  name: 'Vasya',
  info: {
    permissions: [{ id: 1 }],
  },
});
```

Валидация отдельных value

```ts
import { number, string, max } from '@astral/validations';

// undefined
number()(22)

// { message: 'Обязательно' }
string()('')

// { message: 'Макс. символов: 5' }
string(max(5))('123456')
```

---

# Guards

Guard - правило, выполняющее проверку на тип данных. Guard должен быть предикатом для любой валидации.

Каждый guard:
- Проверяет значение на required (для каждого типа данных своя проверка)
- Имеет метод ```define```, позволяющий переопределять стандартные параметры guard

## number

- Возвращает ошибку если:
  - Тип value не number
  - Value является NaN
  - Value является Infinity
- Проверяет value на required
- Выполняет композицию правил, переданных в параметры

```ts
import { number, min, max } from '@astral/validations';

const validate = number(min(1), max(22));

// undefined
validate(20)

// { message: 'Не число' }
validate('string')

// { message: 'Некорректное число' }
validate(NaN)

// { message: 'Бесконечное число' }
validate(Infinity)

// { message: 'Обязательно' }
validate(undefined)

// { message: 'Обязательно' }
validate(null)
```

### min number

Позволяет указать ограничение на минимальное число.

```ts
import { number, min } from '@astral/validations';

const validate = number(min(1));

// undefined
validate(20)

// undefined
validate(1)

// { message: 'Не меньше: 1' }
validate(0)
```

---

### max number

Позволяет указать ограничение на максимальное число.

```ts
import { number, max } from '@astral/validations';

const validate = number(max(4));

// undefined
validate(4)

// undefined
validate(1)

// { message: 'Не больше: 4' }
validate(10)
```

---

## string

- Возвращает ошибку если:
  - Тип value не string
- Проверяет value на required
- Выполняет композицию правил, переданных в параметры

```ts
import { string, min, onlyNumber } from '@astral/validations';

const validate = string(min(1), onlyNumber());

// undefined
validate('name')

// { message: 'Не является строкой' }
validate(20)

// { message: 'Обязательно' }
validate('')
// { message: 'Обязательно' }
validate(undefined)
// { message: 'Обязательно' }
validate(null)
```

### min string

Позволяет указать ограничение на минимальное количество символов в строке.

```ts
import { string, min } from '@astral/validations';

const validate = string(min(2));

// undefined
validate('vasya')

// undefined
validate('va')

// { message: 'Мин. символов: 2' }
validate('v')
```

---

### max string

Позволяет указать ограничение на максимальное количество символов в строке.

```ts
import { string, max } from '@astral/validations';

const validate = string(max(6));

// undefined
validate('hello')

// undefined
validate('va')

// { message: 'Макс. символов: 6' }
validate('long string')
```

---

### email

Проверяет валиден ли email. Не работает с русскими доменами

```ts
import { string, email } from '@astral/validations';

const validate = string(email());

// undefined
validate('example@mail.ru');


// { message: 'Некорректный E-mail' }
validate('example.ru');

//Пользовательское сообщение для ошибки с максимальным количеством символов
const validateEmail = email({ invalidLengthMessage: 'слишком длинный email' });

// { message: 'слишком длинный email' }
validateEmail('longlonglong.......')
```

---

### pattern

Проверяет строку на соответствие регулярному выражению.

```ts
import { string, pattern } from '@astral/validations';

const validate = string(
  pattern(/word/g, { message: 'Должен быть word' })
);

// undefined
validate('word')

// { message: 'Должен быть word' }
validate('vasya')
```

---

### onlyNumber

Проверяет на наличие только чисел в строке

```ts
import { string, onlyNumber } from '@astral/validations';

const validate = string(onlyNumber());

// undefined
validate('12345')

// { message: 'Строка должна содержать только числа' }
validate('a12345')
validate('1.2345')
validate('-1.2345')
```

---

### snils

Проверяет валиден ли СНИЛС

```ts
import { string, snils } from '@astral/validations';

const validate = string(snils());

// undefined
validate('15657325992')

// { message: 'Некорректный СНИЛС' }
validate('95145370511')
validate('156-573-259 92')
```

:information_source: Поддерживает [exclude](#exclusion-managing)

---

### mobilePhone

- Проверяет валиден ли мобильный телефон
- Валидный телефон начинается с "79" и не содержит символов, кроме цифр.

```ts
import { string, mobilePhone } from '@astral/validations';

const validate = string(mobilePhone());

// undefined
validate('79999999999')

// { message: 'Некорректный номер телефона' }
validate('7 (999) 99-99-999')
validate('89999999999')
validate('+79999999999')
```

:information_source: Поддерживает [exclude](#exclusion-managing)

---

### innUL

Проверяет валиден ли ИНН ЮЛ

```ts
import { string, innUL } from '@astral/validations';

const validate = string(innUL());

// undefined
validate('7728168971')

// { message: 'Некорректный ИНН ЮЛ' }
validate('0000000000')
validate('384212952720')
validate('7728168911')
```

:information_source: Поддерживает [exclude](#exclusion-managing)

---

### innIP

Проверяет валиден ли ИНН ИП

```ts
import { string, innIP } from '@astral/validations';

const validate = string(innIP());

// undefined
validate('384212952720')

// { message: 'Некорректный ИНН ИП' }
validate('3842129527')
validate('384212952a20')
validate('+384212952720')
```

:information_source: Поддерживает [exclude](#exclusion-managing)

---

### kpp

Проверяет валиден ли КПП

```ts
import { string, kpp } from '@astral/validations';

const validate = string(kpp());

// undefined
validate('770201001');

// { message: 'Некорректный КПП' }
validate('123123')
validate('00000000')
```

:information_source: Поддерживает [exclude](#exclusion-managing)

---

### ogrnIP

Проверяет валиден ли ОГРН ИП

```ts
import { string, ogrnIP } from '@astral/validations';

const validate = string(ogrnIP());

// undefined
validate('8104338364837')

// { message: 'Некорректный ОГРН ИП' }
validate('1175958036814')
validate('1175958000004')
validate('1-22-33-44-5555555-6')
```

:information_source: Поддерживает [exclude](#exclusion-managing)

---

### ogrnUL

Проверяет валиден ли ОГРН ЮЛ

```ts
import { string, ogrnUL } from '@astral/validations';

const validate = string(ogrnUL());

// undefined
validate('1214000000092')

// { message: 'Некорректный ОГРН ЮЛ' }
validate('1175958036814')
validate('1175958000004')
validate('1-22-33-5555555-6')
```

:information_source: Поддерживает [exclude](#exclusion-managing)

---

## date

- Возвращает ошибку если:
  - Тип value не является объектом Date
  - Date является invalid date
- Проверяет value на required
- Выполняет композицию правил, переданных в параметры

```ts
import { date } from '@astral/validations';

const validate = date();

// undefined
validate(new Date());

// { message: 'Некорректная дата' }
validate(new Date('22.22.2022'));

// { message: 'Не дата' }
validate('12.12.2022');

// { message: 'Обязательно' }
validate(undefined);
```

### min date

Позволяет указать минимальную дату.
При сверке дат игнорируется время, которое может быть отличное от 00:00:00 в объекте Date.

```ts
import { date, min } from '@astral/validations';

const validate = date(
  min(new Date('12-12-2022'), { message: 'Начиная с 12 января 2022 года' }),
);

// { message: 'Начиная с 12 января 2022 года' }
validate(new Date('12-11-2022'));

// undefined
validate(new Date('12-14-2022'));

```

---

### max date

Позволяет указать максимальную дату.
При сверке дат игнорируется время, которое может быть отличное от 00:00:00 в объекте Date.

```ts
import { date, max } from '@astral/validations';

const validate = date(
  max(new Date('12-12-2022'), { message: 'Не позднее 12 января 2022 года' }),
);

// { message: 'Не позднее 12 января 2022 года' }
validate(new Date('15-11-2022'));

// undefined
validate(new Date('02-01-2021'));

```

---

## boolean

- Возвращает ошибку если:
  - Тип value не boolean
- Проверяет value на required
- Выполняет композицию правил, переданных в параметры

```ts
import { boolean } from '@astral/validations';

const validate = boolean();

// undefined
validate(true)

// { message: 'Не boolean' }
validate('string')

// { message: 'Обязательно' }
validate(false)

// { message: 'Обязательно' }
validate(undefined)

// { message: 'Обязательно' }
validate(null)
```

---

## object

- Позволяет валидировать объект по схеме
- Возвращает ошибку если:
  - Value не является простым объектом
  - Свойства не соответсвуют переданной схеме валидации
- Возвращаем объект ошибок, соответсвующих ошибкам для свойств объекта
- Требует схему для валидации, свойства которой должны соответсвовать валидируемому values

```ts
import {
  object,
  array,
  arrayItem,
  string,
  optional,
  min,
  number
} from '@astral/validations';

type User = {
  name: string;
  surname?: string;
  info: {
    permissions: Permission[];
  };
};

const validate = object<User>({
  name: string(),
  surname: optional(string()),
  info: object<User['info']>({
    permissions: array(
      arrayItem(
        object<Permission>({
          id: number(),
          description: string(min(2)),
        }),
      ),
    ),
  }),
});

// undefined
validate({
  name: 'Vasya',
  info: {
    permissions: [{ id: 1, description: 'my permission' }],
  },
});

// Error in info.permissions.0.description: Обязательно
validate({
  name: 'Vasya',
  info: {
    permissions: [{ id: 1 }],
  },
});
```

### partial

Позволяет сделать все поля объекта optional.

```ts
import { partial, object, string } from '@astral/validations';

type Values = {
  name: string;
  surname: string;
};

const validateRequired = object<Values>({
  name: string(),
  surname: string()
})

// { message: 'Ошибка в свойстве name: Обязательно' }
validateRequired({});

const validatePartial = partial(
  object<Values>({
    name: string(),
    surname: string()
  })
);

// undefined
validatePartial({});
```

---

### deepPartial

Позволяет сделать гулбокий partial для свойсв всех объектов в схеме, включая объекты в массиве.

```ts
import {
  object,
  array,
  arrayItem,
  string,
  deepPartial,
  min,
  number
} from '@astral/validations';

type Permission = {
  id: number;
  description: string;
};

type User = {
  name: string;
  surname?: string;
  info: {
    permissions: Permission[];
  };
};

const validate = deepPartial(
  object<User>({
    name: string(),
    surname: optional(string()),
    info: object<User['info']>({
      permissions: array(
        arrayItem(
          object<Permission>({
            id: number(),
            description: string(min(2)),
          }),
        ),
      ),
    }),
  })
);

// undefined
validate({
  info: [{ }],
});
```

---

## array

- Позволяет валидировать array
- Возвращает ошибку если:
  - Value не является array
- Выполняет композицию правил, переданных в параметры

```ts
import {
  array,
  arrayItem,
  min
} from '@astral/validations';

type User = {
  name: string;
  surname?: string;
};

const validate = array(
  min(1),
  arrayItem(
    object<User>({
      name: string(),
      surname: optional(string()),
    }),
  ),
);

// undefined
validate([{ name: 'Vasya' }]);

// { message: 'Не меньше: 1' }
validate([]);

// { cause: { errorArray: [{ name: { message: 'Не является строкой' } }] } }
validate([{ name: 22 }]);
```

### arrayItem

Применяет переданные правила валидации к каждому элементу массива.

```ts
import { array, arrayItem, object, string, optional } from '@astral/validations';

type User = {
  name: string;
  surname?: string;
};

const validate = array(
  arrayItem(
    object<User>({
      name: string(),
      surname: optional(string()),
    }),
  ),
);

// undefined
validate([{ name: 'Vasya' }]);

// { cause: { errorArray: [{ name: { message: 'Не является строкой' } }] } }
validate([{ name: 22 }]);
```

```ts
import { array, arrayItem, string, min } from '@astral/validations';

const validate = array(arrayItem(string(min(3))));

// { cause: { arrayError: [undefined, { message: 'Мин. символов: 3' }] } }
validate(['vasya', 'ma']);
```

---

### min array

Позволяет указать ограничение на минимальное количество элементов в массиве.

```ts
import { array, min } from '@astral/validations';

const validate = array(min(1));

// { message: 'Не меньше: 1' }
validate([]);

// undefined
validate([1, 2]);
```

---

### max array

Позволяет указать ограничение на максимальное количество элементов в массиве.

```ts
import { array, max } from '@astral/validations';

const validate = array(max(3));

// { message: 'Не больше: 3' }
validate([1,2,3,4]);

// undefined
validate([1, 2]);
```

---

## Define. Переопределение дефолтных параметров guard

Каждый guard позволяет переопределить дефолтные параметры:
- Сообщение об ошибке типа
- Сообщение о ошибке required
- Уникальные для каждого guard параметры

```ts
import { string } from '@astral/validations';

const validateCustomString = string().define({
  typeErrorMessage: 'Только строка',
  requiredErrorMessage: 'Не может быть пустым',
});

// { message: 'Не может быть пустым' }
validateCustomString(undefined);

// { message: 'Только строка' }
validateCustomString(20);
```

---

# Custom rules

Каждый guard поддерживает кастомные правила.

## Базовый пример

```ts
import { string, object } from '@astral/validations';

type Values = {
  name: string;
  nickname: string;
};

const validate = object<Values>({
  name: string(),
  nickname: string((value, ctx) => {
    if (value.includes('_')) {
      return ctx.createError({
        message: 'Символ "_" запрещен',
        code: 'nickname-symbol',
      });
    }

    return undefined;
  }),
});

// { cause: { errorMap: { nickname: { message: 'Символ "_" запрещен', code: 'nickname-symbol' } } } }
validate({ name: 'Vasya', nickname: 'va_sya' });
```

## Связанные поля и условная валидация

В ```ctx.global.values``` находится value, принятое самым верхнеуровневым guard'ом.

```ts
import { string, object, boolean, min, optional } from '@astral/validations';

type Values = {
  isAgree?: boolean;
  info: {
    reason?: string;
  };
};

const validate = object<Values, Values>({
  isAgree: optional(boolean()),
  info: object<Values['info'], Values>({
    reason: (_, ctx) => {
      if (!ctx.global.values.isAgree) {
        return optional(string());
      }

      return string(min(3));
    },
  }),
});

// undefined
validate({ isAgree: false, info: {} });

// { cause: { errorMap: { info: { cause: { errorMap: { reason: { message: 'Обязательно' } } } } } } }
validate({ isAgree: true, info: {} });
```

## Переиспользуемое правило

```ts
import { createRule, string } from '@astral/validations';

type Params = {
  message?: string;
};

const includesWorld = <TValues>(params: Params) =>
  createRule<string, TValues>((value, ctx) => {
    if (value.includes('world')) {
      return undefined;
    }

    return ctx.createError({
      message: params?.message || 'Должен содержать "world"',
      code: 'includes-word',
    });
  });

const validate = string(includesWorld());

// undefined
validate('Hello world');

// { message: 'Должен содержать "world"' } 
validate('Hello');

// { message: 'Должен содержать "world"' } 
includesWorld()('Hello')
```

---

# Common

## optional

Выключает дефолтную проверку на required в guard.

```ts
import { optional, object, string, boolean, array } from '@astral/validations';

type Values = {
  name: string;
  surname?: string;
  permissions?: number[];
  isAuth?: boolean;
};

const validate = object<Values>({
  name: string(),
  surname: optional(string()),
  permissions: optional(array(string())),
  isAuth: optional(boolean()),
})

// undefined
validate({
  name: 'Vasya',
  surname: '',
  isAuth: false,
});
```

---

## transform

Позволяет изменять value в цепочке композиции.

```ts
import { transform, date, min } from '@astral/validations';

const validate = string(
  transform((value) => new Date(value), date(min(new Date()))),
);

// { message: 'Некорректная дата' }
validate('22.22.2022');

// undefined
validate('12.12.2022');
```

---

## or

Выполняет переданные правила аналогично оператору ||. Если одно из правил не завершилось ошибкой, то or вернет undefined.
Если все переданные правила завершились с ошибкой, то вернется ошибка из последнего правила

```ts
import { or, array, string, number } from '@astral/validations';

const validate = or(string(), array(), number());

// undefined
validate('string')

// undefined
validate([])

// undefined
validate(20)

// { message: 'Не число' }
validate(new Date())
```

---

# Integrations

## react-hook-form

Для интеграции с react-hook-form необходимо использовать пакет ```@astral/validations-react-hook-form-resolver```.

```tsx
import { object, string, optional } from '@astral/validations';
import { resolver } from '@astral/validations-react-hook-form-resolver';
import { useForm } from 'react-hook-form';

type Values = {
    name: string;
    info: { description?: string }
};

const validationSchema = object<Values>({
  name: string(),
  info: object<Values['info']>({
    description: optional(string()),
  }),
});

const Form = () => {
  const { register, handleSubmit, formState } = useForm<Values>({
    resolver: resolver<Values>(validationSchema),
  });

  return (
    <form onSubmit={handleSubmit(() => {})}>
      <input {...register('name')} />
      {formState.errors.name && (
        <p>{formState.errors.name.message}</p>
      )}
      <input {...register('info.description')} />
      {formState.errors.info?.description && (
        <p>{formState.errors.info.description.message}</p>
      )}
      <button type="submit">submit</button>
    </form>
  );
};
```

# Error message customization

Сообщения об ошибках по умолчанию могут быть заменены на пользовательские.  
Для этого необходимо использовать параметры `message` или `getMessage` у валидационных методов:

```ts
//getMessage
const validateMin = number(min(10, {
    getMessage: (threshold, value, ctx) => {
        return `Слишком мало, минимум ${threshold}`
    }
}));
// { message: 'Слишком мало, минимум 10' }
validateMin(5);

//message
const validateKPP = string(kpp({ message: 'Что-то не так с кодом КПП' }));
// { message: 'Что-то не так с кодом КПП' }
validateKPP('123123');
```

---

# Exclusion managing

Метод `exclude` предоставляет возможность обхода валидации для конкретного значения.  
Если функция вернет `true`,
текущее значение не будет провалидировано, метод валидации вернет `undefined`.

Пример реализации:

```ts
//значение для обхода валидации (исключение)
const excludeValue = '0101010101';
//функция для обработки исключения
const isExclude = (value: string) => {
  const excluded: string[] = [excludeValue];

  return excluded.includes(value);
};

const validate = string(kpp({ exclude: isExclude }));
// undefined (значение не будет провалидировано)
validate(excludeValue);
```
