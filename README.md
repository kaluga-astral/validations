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
    - [integer](#integer)
    - [positiveNumber](#positivenumber)
  - [string](#string)
    - [min](#min-string)
    - [max](#max-string)
    - [email](#email)
    - [guid](#guid)
    - [length](#length)
    - [pattern](#pattern)
    - [onlyNumber](#onlyNumber)
    - [containsNumbers](#containsNumbers)
    - [containsDifferentCases](#containsDifferentCases)
    - [containsPunctuationMarks](#containsPunctuationMarks)
    - [snils](#snils)
    - [mobilePhone](#mobilePhone)
    - [innUL](#innUL)
    - [innIP](#innIP)
    - [innFL](#innFL)
    - [innTwelveSymbols](#innTwelveSymbols)
    - [kpp](#kpp)
    - [ogrnIP](#ogrnIP)
    - [ogrnUL](#ogrnUL)
    - [personName](#personName)
    - [personSurname](#personSurname)
    - [personPatronymic](#personPatronymic)
    - [passportSeries](#passportSeries)
    - [passportNumber](#passportNumber)
    - [passportCode](#passportCode)
    - [textField](#textField)
  - [date](#date)
    - [min](#min-date)
    - [max](#max-date)
    - [minYearsOld](#min-years-old-date)
  - [boolean](#boolean)
  - [object](#object)
    - [partial](#partial)
    - [deepPartial](#deepPartial)
  - [array](#array)
    - [arrayItem](#arrayItem)
    - [min](#min-array)
    - [max](#max-array)
  - [any](#any)
  - [Define. Переопределение дефолтных параметров guard](#define-переопределение-дефолтных-параметров-guard)
- [Custom rules](#custom-rules)
  - [Базовый пример](#базовый-пример)
  - [Связанные поля](#связанные-поля)
  - [Доступ к ctx.global.values](#доступ-к-высокоуровневым-values-ctxglobalvalues)
  - [Переиспользуемое правило](#переиспользуемое-правило)
  - [Кастомная условная валидация](#кастомная-условная-валидация)
- [Common](#common)
  - [optional](#optional)
  - [when. Условная валидация](#when-условная-валидация)
  - [transform](#transform)
  - [or](#or)
- [Async](#async)
- [Integrations](#integrations)
  - [react-hook-form](#react-hook-form)
- [Guides](#guides)
  - [Переиспользование объектов схемы](#переиспользование-объектов-схемы)
  - [Переиспользование объектов схемы, с условной валидацией и зависимыми полями](#переиспользование-объектов-схемы-с-условной-валидацией-и-зависимыми-полями)
  - [Error message customization](#error-message-customization)
  - [Exclusion managing](#exclusion-managing)
- [Migration Guide](#migration-guide)
  
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

Валидация объекта с вложенным массивом.

### [Codesandbox](https://codesandbox.io/s/astral-validations-basic-usage-jkpjr5?file=/main.ts)

```ts
import {
  object,
  array,
  arrayItem,
  string,
  optional,
  min,
  number,
  toPrettyError,
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

// { info: { permissions: [{ description: 'Обязательно' }] } }
toPrettyError(
  validate({
    name: 'Vasya',
    info: {
        permissions: [{ id: 1 }],
    },
  })
);
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

### integer

Проверяет является ли значение целым числом.

```ts
import { number, integer } from '@astral/validations';

const validate = number(integer(5));

// undefined
validate(5)

// undefined
validate(7)

// { message: 'Только целые числа' }
validate(3.14)
```

---

### positiveNumber

Проверяет является ли значение положительным числом.

```ts
import { number, positiveNumber } from '@astral/validations';

const validate = number(positiveNumber(3));

// undefined
validate(3)

// { message: 'Только положительное числа' }
validate(0)

// { message: 'Только положительное числа' }
validate(-1)
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

### guid

Проверяет валиден ли GUID.

```ts
import { string, guid } from '@astral/validations';

const validate = string(guid());

// undefined
validate('C56A4180-65AA-42EC-A945-5FD21DEC0538');


// { message: 'Некорректный GUID' }
validate('x56a4180-h5aa-42ec-a945-5fd21dec0538');
```

---

### length

Проверяет значение на соответствие длине.

```ts
import { string, length } from '@astral/validations';

const validate = string(length(5));

// undefined
validate('aaaaa');


// { message: 'Кол-во символов должно быть: 5' }
validate('abc');
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

### containsNumbers

Проверяет на наличие чисел в строке

```ts
import { string, containsNumbers } from '@astral/validations';

const validate = string(containsNumbers());

// undefined
validate('test12345')

// { message: 'Строка должна содержать числа' }
validate('test')
```

---

### containsDifferentCases

Проверяет на наличие в строке символов разных регистров

```ts
import { string, containsDifferentCases } from '@astral/validations';

const validate = string(containsDifferentCases());

// undefined
validate('testTEST')
validate('тестТЕСТ')

// { message: 'Строка должна содержать символы разного регистра' }
validate('test')
validate('ТЕСТ')
```

---

### containsPunctuationMarks

Проверяет на наличие в строке знаков пунктуации !$%&’()+,-./:;<=>?@[]^_{|}”

```ts
import { string, containsPunctuationMarks } from '@astral/validations';

const validate = string(containsPunctuationMarks());

// undefined
validate('test?')

// { message: 'Строка должна содержать знаки пунктуации' }
validate('test')
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

### textField

Проверяет валидно ли текстовое поле

```ts
import { string, textField } from '@astral/validations';

const validate = string(textField());

// undefined
validate('!@#$%^&*()-_=+|[]{};:",.<>/?')
validate('абвАБВ abcABC')

// { message: 'Содержит запрещённые символы' }
validate('😀')
validate('∑')
validate('٩(◕‿◕｡)۶')
```

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

### innFL

Проверяет валиден ли ИНН ФЛ

```ts
import { string, innFL } from '@astral/validations';

const validate = string(innFL());

// undefined
validate('384212952720')
validate('000000000000')

// { message: 'Некорректный ИНН ФЛ' }
validate('3842129527')
validate('384212952a20')
validate('+384212952720')
```

:information_source: Поддерживает [exclude](#exclusion-managing)

---

### innTwelveSymbols

Проверяет валиден ли ИНН из 12 символов

```ts
import { string, innTwelveSymbols } from '@astral/validations';

const validate = string(innTwelveSymbols());

// undefined
validate('384212952720')

// { message: 'Некорректный ИНН' }
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

### personName

Проверяет валидно ли имя

#### [Требования на реализацию](https://track.astral.ru/soft/wiki/pages/viewpage.action?pageId=3813152849#id-Требованиянареализацию-Требование5.Поле"Имя")

```ts
import { string, personName } from '@astral/validations';

const validate = string(personName());

// undefined
validate('Иван');
validate('иван');

// { message: 'Проверьте имя' }
validate('');
validate('Иван--Иван');
```

---

### personSurname

Проверяет валидно ли фамилия

#### [Требования на реализацию](https://track.astral.ru/soft/wiki/pages/viewpage.action?pageId=3813152849#id-Требованиянареализацию-Требование4.Поле"Фамилия")

```ts
import { string, personSurname } from '@astral/validations';

const validate = string(personSurname());

// undefined
validate('Иванов');
validate('иванов');

// { message: 'Проверьте фамилию' }
validate('');
validate('Иванов--иванов');
```

---

### personPatronymic

Проверяет валидно ли отчество

#### [Требования на реализацию](https://track.astral.ru/soft/wiki/pages/viewpage.action?pageId=3813152849#id-Требованиянареализацию-Требование6.Поле"Отчество")

```ts
import { string, personPatronymic } from '@astral/validations';

const validate = string(personPatronymic());

// undefined
validate('Иванович');
validate('иванович');


// { message: 'Проверьте отчество' }
validate('');
validate('Иванович--Иванович');
```

---

### passportSeries

Проверяет валидна ли серия паспорта

#### [Требования на реализацию](https://track.astral.ru/soft/wiki/pages/viewpage.action?pageId=3813152849#id-Требованиянареализацию-8.1.Серияпаспорта)

```ts
import { string, passportSeries } from '@astral/validations';

const validate = string(passportSeries());

// undefined
validate('9217');

// { message: 'Проверьте серию' }
validate('0017');

// { message: 'Длина поля должна быть равна 4 символам' }
validate('917');

// { message: 'Только цифры' }
validate('91а7');
```

---

### passportNumber

Проверяет валиден ли номер паспорта

#### [Требования на реализацию](https://track.astral.ru/soft/wiki/pages/viewpage.action?pageId=3813152849#id-Требованиянареализацию-8.2.Номерпаспорта)

```ts
import { string, passportNumber } from '@astral/validations';

const validate = string(passportNumber());

// undefined
validate('704564');

// { message: 'Проверьте номер' }
validate('000100');

// { message: 'Длина поля должна быть равна 6 символам' }
validate('7045');

// { message: 'Только цифры' }
validate('70а5');
```

---

### passportCode

Проверяет валиден ли код паспорта

#### [Требования на реализацию](https://track.astral.ru/soft/wiki/pages/viewpage.action?pageId=3813152849#id-Требованиянареализацию-8.3.Кодподразделения)

```ts
import { string, passportCode } from '@astral/validations';

const validate = string(passportCode());

// undefined
validate('123256');

// { message: 'Проверьте код' }
validate('000-456');

// { message: 'Длина поля должна быть равна 6 символам' }
validate('1234');

// { message: 'Только цифры' }
validate('1а3');
```


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

### #min years old date

Принимает возраст и вычитает переданное количество лет из текущей даты. Позволяет кастомизировать текст ошибки.

```ts
import { date, minYearsOld } from '@astral/validations';

const validate = date(
  minYearsOld(18, {
    customErrorMessage:
            'Только совершеннолетние могут воспользоваться данной услугой',
  }),
);

// { message: 'Только совершеннолетние могут воспользоваться данной услугой' }
validate(new Date('15.11.2022'));

// undefined
validate(new Date('10.10.2005'));

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
  number,
  toPrettyError
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

// { info: { permissions: [{ description: 'Обязательно' }] } }
toPrettyError(
  validate({
    name: 'Vasya',
    info: {
      permissions: [{ id: 1 }],
    },
  })
);
```

### partial

Позволяет сделать все поля объекта optional.

```ts
import { partial, object, string, toPrettyError } from '@astral/validations';

type Values = {
  name: string;
  surname: string;
};

const validateRequired = object<Values>({
  name: string(),
  surname: string()
})

// { name: 'Обязательно' }
toPrettyError(
  validateRequired({})
);

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
  info: {
    permissions: [{}]
  },
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
  min,
  toPrettyError
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

// [{ name: 'Не является строкой' }]
toPrettyError(
  validate([{ name: 22 }])
);
```

### arrayItem

Применяет переданные правила валидации к каждому элементу массива.

```ts
import { array, arrayItem, object, string, optional, toPrettyError } from '@astral/validations';

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
toPrettyError(
  validate([{ name: 22 }])
);
```

```ts
import { array, arrayItem, string, min, toPrettyError } from '@astral/validations';

const validate = array(arrayItem(string(min(3))));

// [undefined, 'Мин. символов: 3']
toPrettyError(
  validate(['vasya', 'ma'])
);
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

## any

Позволяет выключить любые проверки и делать композицию для правил, валидирующих любые значения.

```ts
type Values = { name: string; isAgree: boolean };

const validate = object<Values>({
  name: when({
    is: (_, ctx) => Boolean(ctx.values?.isAgree),
    then: string(),
    otherwise: any(),
  }),
  isAgree: optional(boolean()),
});

// undefined
validate({ isAgree: false, name: '' });

// { name: 'Обязательно' }
toPrettyError(
  validate({ isAgree: true, name: '' })
);
```
```ts
  const validate = any(transform((value) => new Date(value), date()));

// undefined
validate('12.22.2022');

// invalid date error
validate('13.22.2022');
```

## Define. Переопределение дефолтных параметров guard

Каждый guard позволяет переопределить дефолтные параметры:
- Сообщение об ошибке типа
- Сообщение об ошибке required
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
import { string, object, toPrettyError } from '@astral/validations';

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

// { nickname: 'Символ "_" запрещен' }
toPrettyError(
  validate({ name: 'Vasya', nickname: 'va_sya' })
);
```

## Связанные поля

В ```ctx.values``` находится value, принятое последним object.

```ts
import { object, string, toPrettyError } from '@astral/validations';

type Values = {
  password: string;
  repeatPassword: string;
};

const validate = object<Values>({
  password: string(min(9)),
  repeatPassword: string(min(9), (value, ctx) => {
    if (value !== ctx.values?.password) {
      return ctx.createError({
        message: 'Пароли не совпадают',
        code: 'repeat-password',
      });
    }

    return undefined;
  }),
});

// { repeatPassword: 'Пароли не совпадают' } 
toPrettyError(
  validate({ password: 'qywerty123', repeatPassword: 'qywerty1234' })
);
```


## Доступ к высокоуровневым values (```ctx.global.values```)

В ```ctx.global.values``` находится values, полученное самым первым guard.

```ts
import { object, string, boolean, optional } from '@astral/validations';

type Values = {
  isAgree: boolean;
  info: {
    name: string
  }
};

const validate = object<Values>({
  isAgree: optional(boolean()),
  info: object<Values['info']>({
    name: when({
      is: (_, ctx) => Boolean(ctx.global.values?.isAgree),
      then: string(),
      otherwise: any(),
    }),
  })
});
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

## Кастомная условная валидация

Для условной валидации рекомендуется использовать [when](#when-условная-валидация), но также доступна возможность реализации кастомной условной валидации.

```ts
import { object, string, boolean, optional } from '@astral/validations';

type Values = {
  isAgree: boolean;
  info: {
    name: string
  }
};

const validate = object<Values>({
  isAgree: optional(boolean()),
  info: object<Values['info']>({
    name: (value, ctx) => {
      if(ctx.global.values?.isAgree) {
        return string();
      }
      
      return any();
    }
  })
});
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

Позволяет делать optional вложенные правила:

```ts
type Values = { name: string | number; isAgree: boolean };

const validate = object<Values>({
  name: optional(
    when({
      is: (_, ctx) => Boolean(ctx.values?.isAgree),
      then: string(),
      otherwise: number(),
    })
  ),
  isAgree: optional(boolean()),
});

// undefined
validate({ isAgree: false, name: undefined });
```

---

## when. Условная валидация

Позволяет определять условные валидации.

```ts
type Values = { name: string; isAgree: boolean };

const validate = object<Values>({
  name: when({
    is: (_, ctx) => Boolean(ctx.values?.isAgree),
    then: string(),
    otherwise: any(),
  }),
  isAgree: optional(boolean()),
});

// undefined
validate({ isAgree: false, name: '' });

// { name: 'Обязательно' }
toPrettyError(
  validate({ isAgree: true, name: '' })
);
```

When для ветки объекта:
```ts
type ValuesInfo = { surname: string };

type Values = {
  name: string;
  info?: ValuesInfo;
};

const validate = object<Values>({
  name: string(),
  info: when({
    is: (_, ctx) => ctx.values?.name === 'Vasya',
    then: object<ValuesInfo>({ surname: string() }),
    otherwise: any(),
  }),
});

// { info: 'Обязательно' }
toPrettyError(
  validate({ name: 'Vasya' })
);

// undefined
validate({ name: 'Kolya' });
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

# Async
Пакет поддерживает асинхронную валидацию.

Guard, поддерживающие асинхронную валидацию имеют постфиксы ```async```:
- ```objectAsync```
- ```stringAsync```
- ```optionalAsync```

Пример:

```ts
type Values = {
    nickname: string;
    phone: string;
};

const validate = objectAsync<Values>({
    phone: string(),
    nickname: stringAsync(min(3), async (value, ctx) => {
        const nicknameIsAvailable = await checkNickname(value);

        if (nicknameIsAvailable) {
            return undefined;
        }

        return ctx.createError({
            code: 'nickname-available',
            message: 'Nickname занят',
        });
    }),
    fullName: optionalAsync(stringAsync(async (value, ctx) => {
        const nicknameIsAvailable = await checkNickname(value);

        if (nicknameIsAvailable) {
            return undefined;
        }

        return ctx.createError({
            code: 'nickname-available',
            message: 'Nickname занят',
        });
    })),
});

const result = await validate({ phone: '79308999999', nickname: 'Vasya', fullName: '' });

// { nickname: 'Nickname занят' }
toPrettyError(result);
```

---

# Integrations

## react-hook-form

Для интеграции с react-hook-form необходимо использовать пакет ```@astral/validations-react-hook-form-resolver```.

### [Codesandbox](https://codesandbox.io/s/astral-validations-react-hook-form-tnq4of?file=/src/Form.tsx)

### Basic usage

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

### Переиспользуемый useForm

```tsx
import { ObjectGuard, object, optional, string } from '@astral/validations';
import { resolver } from '@astral/validations-react-hook-form-resolver';
import {
  FieldValues,
  UseFormReturn,
  UseFormProps as UseReactHookFormProps,
  useForm as useReactHookForm,
} from 'react-hook-form';

type UseFormProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  UseReactHookFormProps<TFieldValues>,
  'resolver'
> & {
  validationSchema?: ObjectGuard<TFieldValues, TFieldValues>;
};

const useForm = <TFieldValues extends FieldValues = FieldValues>({
  validationSchema,
  defaultValues,
  ...params
}: UseFormProps<TFieldValues>): UseFormReturn<TFieldValues> =>
  useReactHookForm<TFieldValues>({
    ...params,
    defaultValues,
    resolver: validationSchema && resolver(validationSchema),
  });

type Values = {
  name: string;
  info: { description?: string };
};

const validationSchema = object<Values>({
  name: string(),
  info: object<Values['info']>({
    description: optional(string()),
  }),
});

const Form = () => {
  const { register, handleSubmit, formState } = useForm<Values>({
    validationSchema,
  });

  return (
    <form onSubmit={handleSubmit(() => {})}>
      <input {...register('name')} />
      {formState.errors.name && <p>{formState.errors.name.message}</p>}
      <input {...register('info.description')} />
      {formState.errors.info?.description && (
        <p>{formState.errors.info.description.message}</p>
      )}
      <button type="submit">submit</button>
    </form>
  );
};
```

# Guides


## Переиспользование объектов схемы

```ts
type Address = {
  street: string;
};

const address = object<Address>({ street: string() });

type Organization = {
  address: Address;
};

const organization = object<Organization>({ address });

type Values = {
  name: string;
  org: Organization;
};

const validateValues = object<Values>({
  name: string(),
  org: organization,
});
```

---

## Переиспользование объектов схемы, с условной валидацией и зависимыми полями

```ts
type RusOrganization = {
  inn: string;
  isIP: boolean;
};

type EngOrganization = {
  name: string;
};

type Values = {
  isRus: boolean;
  org: { data: RusOrganization | EngOrganization };
};

const rusOrganization = object<RusOrganization>({
  inn: string(
    when({
      is: (_, ctx) => Boolean((ctx.global.values as Values)?.isRus),
      then: rusOrganization,
      otherwise: engOrganization,
    }),
  ),
  isIP: optional(boolean()),
});

const engOrganization = object<EngOrganization, Values>({ name: string() });

const organization = when<Values>({
  is: (_, ctx) => Boolean((ctx.global.values as Values)?.isRus),
  then: rusOrganization,
  otherwise: engOrganization,
});

const validate = object<Values>({
  isRus: optional(boolean()),
  org: organization,
});
```

---

## Error message customization

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

## Exclusion managing

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

# Migration guide

## v3 -> v4

### object

Generic object guard стал принимать один параметр - валидируемое значение.

### Типизация guard и rules

Generics правил и guards стали принимать тип для ```ctx.values``` вместо ```ctx.global.values```.

### ctx.global.values

```ctx.global.values``` стал ```unknown```. Для использования необходимо вручную уточнять тип. [Пример](#доступ-к-высокоуровневым-values-ctxglobalvalues).
