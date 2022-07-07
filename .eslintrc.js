module.exports = {
     root: true,
     parser: '@typescript-eslint/parser',
     plugins: ['@typescript-eslint'],
     parserOptions: {
          tsconfigRootDir: __dirname,
          project: ['./tsconfig.json'],
     },
     settings: {
          'import/resolver': {
               typescript: {
                    project: './tsconfig.json',
               },
          },
     },
     extends: [
          'eslint:recommended',
          'plugin:@typescript-eslint/recommended',
          'plugin:@typescript-eslint/eslint-recommended',
          'plugin:@typescript-eslint/recommended-requiring-type-checking',
          'plugin:import/recommended',
          'plugin:import/typescript',
     ],
     rules: {
          'import/no-named-as-default-member': 'off',
          'import/no-named-as-default': 'off',
          '@typescript-eslint/no-redeclare': ['error'],

          'no-unused-vars': 'off',
          '@typescript-eslint/no-unused-vars': ["error"],
          '@typescript-eslint/no-unsafe-assignment': 'off',
          '@typescript-eslint/no-unsafe-return': 'off',
          '@typescript-eslint/no-unsafe-call': 'off',
          '@typescript-eslint/no-unsafe-member-access': 'off',
          '@typescript-eslint/no-unsafe-argument': 'off',
          '@typescript-eslint/no-this-alias': 'off',
          "@typescript-eslint/no-floating-promises": "off",

          '@typescript-eslint/no-empty-interface': ['error'],
          '@typescript-eslint/no-non-null-assertion': 'off',
          '@typescript-eslint/no-explicit-any': 'off',
          '@typescript-eslint/no-var-requires': 'off',
          '@typescript-eslint/no-empty-function': 'off',
          '@typescript-eslint/explicit-module-boundary-types': 'off',
     },
};
