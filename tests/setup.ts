// Os testes de unidade não conectam no banco. O client Prisma é instanciado
// na importação de `@/lib/db`, então ele precisa de uma connection string
// sintaticamente válida — mesmo que nenhuma query seja executada.
process.env.DATABASE_URL ??=
  "postgresql://user:pass@localhost:5432/isb_test?schema=public";
