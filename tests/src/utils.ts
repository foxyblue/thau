const TESTABLE_DATA_BACKENDS = process.env.TESTABLE_DATA_BACKENDS as string

export const BACKENDS = TESTABLE_DATA_BACKENDS.split(',').map(
  db => `thau-${db}:9000/api/v1`
)
export const NAME = TESTABLE_DATA_BACKENDS.split(',').reduce(
  (acc: any, db) => ({
    ...acc,
    [`thau-${db}:9000/api/v1`]: db,
  }),
  {}
)
