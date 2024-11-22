# formulAPI

As you may have guessed, this is a Formula 1 Web API! It is driven by data from [f1db](https://github.com/f1db/f1db), the most comprehensive free open source database with all-time Formula 1 racing data and statistics!

## Prerequisites
- Node version 18 (or above)
- Install the dependencies required to run this API by running `pnpm i`
  - If you do not have pnpm installed, run `npm i pnpm -g` in the terminal to install pnpm.
 ## Running the API
- Run `pnpm dev` to start the API in dev mode.
- Run `pnpm build` to build the API and then `pnpm start` to start the API
  - You can send calls to the API easily with the Bruno collection provided in `docs/Bruno Collection`.
## Running tests
- Run `pnpm test` to execute the whole Vitest test suite.
  - `pnpm test:unit` can be run to only execute the unit tests
  - `pnpm test:router` can be run to only execute the router tests
  - `pnpm test:integration` can be run to only execute the integration tests
  - `-- --ui` can be added to run the Vitest UI plugin, which allows for seeing the tests in a useful GUI.
  - `-- --coverage` can be added to run the Vitest Coverage plugin (specifically Istanbul), which allows for generating a coverage report.
  - Adding both of these to `pnpm test` allows for showing the coverage report in the UI.
