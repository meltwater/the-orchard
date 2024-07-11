# the-orchard

A CLI tool that takes your npm dependencies and turns them into script tags for inclusion in your HTML page.

## Usage

```npm i -DE the-orchard```

Once installed the `orchard` cli tool becomes available. For a good description of all the options and flags, please run:

```orchard --help```

## Updating your HTML file using the CLI

All of your dependencies can be inserted into your html file via the cli!

Putting the following text anywhere in a file will result in that string being replaced with the markup for all of the dependencies in your list.

```html
<!--THE_ORCHARD-->
```

We recommend using a separate source file from your output file to allow for source control to ignore the generated output file. The CLI command to accomplish this should look something like:

```bash
orchard -i ./sourceFile.html -o ./outputFile.html
```

## Outputting depcache json format

If you're building an application using systemjs import maps, and utilizing the [depcache](https://github.com/guybedford/import-maps-extensions#depcache) format, you can output the json file to be used by the `orchard` cli tool with the following command:

```bash
orchard -o depcache.json --outputDepcache true
```

This outputs a json file that can be loaded by your solution, and that file will look something like:
```json
[
  "https://unpkg.com/npm@1.0.0/index.js",
  "https://cdn.jsdelivr.net/npm/uhtml@3.0.1/es.js"
]
```

### Usage Implications

In order to selectively serve modern code to modern browsers the script tags generated from the orchard utilize the `type="module"` attribute for es6+ builds, and es5 compatible code uses script tags with the `nomodule` and `defer` attributes.
Browsers that support `type="module"` will only load the tags with that name, and ignore the `nomodule` marked versions.
Legacy browsers that do not support module will ignore the `nomodule` tag as unknown, but will load the script respecting the `defer` attribute.

The big impact here is that any scripts loaded by the orchard are loaded *asynchronously*, so any other scripts depending on anything loaded here must be loaded with the `defer` attribute in the script tag.

This also has a performance benefit of not blocking the page load time while waiting for the scripts to download and be parsed.

## Registry Data

This package relies on a folder being populated with file defining the dependencies you are concerned with in yaml format. See [Registry Data File Formats](#registry-data-file-formats).

The default folder is `orchard`. If you would like an example of a recommended convention for this folder please check out the [demo folder](demo/orchard).

## Registry Data File Formats

The `/registry-data` file formats are documented elsewhere. Follow the link below for more information.

- [dependencies](docs/README.md#dependency-file-format)

## Assumptions when using The Orchard

There are a handful of assumptions we had to make for The Orchard to be functional:

- ALL script tags must be marked `defer` or `type="module"`
  - This is because we mark modern built scripts with `type="module"` and es5 built scripts with `nomodule defer` to allow a division between modern browser builds and legacy browser builds.
- Pinned versions are required
  - If this is a challenge, please reach out to with an issue to help us better understand your use case
- **dependencies** are satisfied at run-time; **devDependencies** at build-time
  - Dependencies:
    - We assume that all dependencies will mark THEIR dependencies packed into their distributed js file as `devDependencies` in the their `package.json`
    - All dependencies expected to be provided by the hosting application should be marked as a `dependency` in the their `package.json`
- Multiple version includes
  - The Orchard will include one entry for each major version of a dependency
  - The exception to this rule is any dependency marked with `conflictsWithOtherMajorVersions` in The Orchard dependency list
    - If two major versions of a conflicting dependency are needed, The Orchard will throw an exception and stop immediately
- Version rollup within major version
  - If two different versions of the same dependency are required, and both are the same major version, we will keep the most up to date version.
  - Ex. some-dependency@1.0.0 and some-dependency@1.4.3 - We will keep some-dependency@1.4.3
- Deepest first order of dependencies
  - Dependencies will be loaded based on their depth in the calculated dependency tree. This is done to resolve dependency loading order.

## Troubleshooting

### Dirty node_modules

The Orchard uses the node_modules directory as the source of truth for
the dependencies required by the application. In a local development context,
that can easily fall out of alignment with what is implied by
`package-lock.json`.

When this happens you may see errors including:

- `npm ERR! Maximum call stack size exceeded`
- `ERROR: Error: EMFILE: too many open files, uv_cwd`
- out of memory

These are often the result of a `npm link` or mismatch of versions in
node_modules.

If this happens, completely remove the node_modules directory and run `npm ci`
to attempt to recover.

This should not be an issue in a CI where the build environment is built from
scratch each time.

### Prerelease package versions

npm supports prerelease tags in package version numbers (e.g. -alpha in
1.0.0-alpha), however the orchard currently doesn't.

This is not by design and we **have plans to resolve this**.
In the meantime, the workaround to test a prerelease dependency in an
orchard build is:

1. Have your dependency tree as up-to-date as the orchard can handle
1. Run the orchard normally
1. Copy the prerelease build into the project
1. Manually override the script tag for the prerelease package to the local path
(e.g. `<script src="prerelease-package.js"></script>`)

### Logging level

There are four logging levels set by using the `--logging` flag on the cli:

- `silent` - No logging at all
- `standard` - Some logging but minimal
- `debug` - A lot of output, but really nitty gritty details aren't shown
- `verbose` - ALL THE THINGS!
