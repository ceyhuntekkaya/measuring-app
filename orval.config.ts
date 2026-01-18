import { defineConfig } from 'orval';

export default defineConfig({
  studyscore: {
    input: {
      target: 'http://localhost:8080/api/api-docs',
    },
    output: {
      mode: 'tags-split',
      target: 'src/api/generated',
      schemas: 'src/api/generated/model',
      client: 'react-query',
      httpClient: 'axios', // ÖNEMLİ: Axios kullanacağımızı belirtiyoruz
      mock: false,
      clean: true,
      prettier: true,
      override: {
        mutator: {
          path: 'src/api/axios-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
});