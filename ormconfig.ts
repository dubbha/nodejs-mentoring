const { MIGRATION } = process.env; // https://github.com/typeorm/typeorm/issues/5763

module.exports = {
  type: 'postgres',
  entities: [MIGRATION ? '**/*.entity.ts' : 'dist/**/*.entity.js'],
  migrations: MIGRATION ? ['migrations/*.ts'] : [],
  cli: { migrationsDir: 'migrations' },
  synchronize: false,
  migrationsRun: true,
};
