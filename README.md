# @astral/validations

Библиотека для валидаций в функциональном стиле.

Поддерживает:
- Tree shaking;
- Валидацию по схеме;
- Работает в Nodejs и в браузере;
- Кастомные правила для валидаций;
- Валидация по схеме для react-hook-form (Resolver).

# Table of contents

- [Installation](#installation)
- [Basic usage](#basic-usage)
- [Guards](#guards)
  - [Number](#number)
  - [String](#string)
  - [Boolean](#boolean)
  - [Object](#object)

# Installation

```shell
npm i --save @astral/validations
```

```shell
yarn add @astral/validations
```

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
    info: [{ id: 1, description: 'my permission' }],
});

// Error для info.0.description: { message: 'Обязательно' }
validate({
    name: 'Vasya',
    info: [{ id: 1 }],
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

# Guards

Guard - правило, выполняющее проверку на тип данных. Guard должен быть предикатом для любой валидации.

Каждый guard:
- Проверяет значение на required (для каждого типа данных своя проверка)
- Имеет метод ```define```, позволяющий переопределять стандартные параметры guard

## Number

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

### Min

## String

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

### Min

## Boolean

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

## Define. Переопределение дефолтных параметров guard


# Кастомные правила
