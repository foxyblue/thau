import * as thau from '../'

const EXPECTED_EXPORT = [
  "AuthProvider",
  "useAuth",
  "useCreateUserWithPassword",
  "useCurrentProvider",
  "useLoginWithFacebook",
  "useLoginWithGoogle",
  "useLoginWithPassword",
  "useLogout",
  "useUser",
]

it('Should export all expected fields', () => {
  expect(Object.keys(thau).sort()).toStrictEqual(EXPECTED_EXPORT)
})