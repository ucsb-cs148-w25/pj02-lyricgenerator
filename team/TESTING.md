# Testing Libraries

## Unit Testing Implementation

### Python 

- Pytest and maybe unittest
- Unit tests will be in the repo
- Mock API calls from frontend to backend

### React

- React Testing library and mpm test
- unit tests will be in the repo
- generate button, upload, login, workflow

### Github Workflows

- Will utilize workflows to autorun unit tests and hopefully, CI/CD tests on each PR to make sure all tests pass

## Unit Testing Plan

- We will not be going full on with unit tests but each team member is expected to write a few unit tests for their code from time to time.
- Basic functions will have unit tests covered.
- There is not enough time to write out all the functionality and, with our need for env files and secret keys for some functions, it is not feasible to test everything.

## Integration Testing Plan

- We will be using `pytest-bdd` to implement integration tests.
- This will be applied on the backend routes.

## Higher Level Testing Plan

- We will not be going full on with higher level tests but each team member is expected to write a few higher level tests for their code from time to time.
- Again, due to the need for `env` files and other API keys, it is not feasable to test everything given the time constraints.

