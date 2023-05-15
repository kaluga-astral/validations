module.exports = {
  'package/**/*.{js,jsx,ts,tsx}': [
    'npm run lint --workspace=@astral/revizor',
    () => 'npm run lint:types --workspace=@astral/revizor',
  ],

  'react-hook-form-resolver/**/*.{js,jsx,ts,tsx}': [
    'npm run lint --workspace=@astral/revizor-react-hook-form-resolver',
    () =>
      'npm run lint:types --workspace=@astral/revizor-react-hook-form-resolver',
  ],

  'pack/**/*.{js}': ['npm run lint --workspace=@astral/pack'],

  'PRTitleLinter/**/*.{js}': ['npm run lint --workspace=@astral/PRTitleLinter'],
};
