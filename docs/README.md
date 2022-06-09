# Registry Data

The folder `/registry-data` contains two subfolders:

- [dependencies](#dependency-file-format)

These files have a specific format that is documented below.

## Dependency file format

The yaml files for dependencies have the following format:

```yaml
'moment':
  # Ownership information
  ownedBy: MomentJs
  repo: https://github.com/moment/moment
  # Only one form of contact is required, but the more we have the easier it is to reach out if needed.
  contact:
    url: https://github.com/moment/moment
  # Technical Details
  basePath: https://unpkg.com/moment@
  # Multiple files can be included if needed
  es5:
    - /min/moment.min.js
  # This will allow for including things like a 'v' prefix if needed
  versionPath: '{{version}}'
  # If two version of this dependency cannot exist at the same time, then this must be set to true
  conflictsWithOtherMajorVersions: true
  # If there is code required to initialize this dependency, then this must be set to true
  requiresInitialization: false
  # The default technical details (above) can be overridden by version, if necessary, to
  # maintain compatability with older releases still in use by applications.
  # This is fabricated, and here purely as an example
  overrides:
    # Versions can be a range. Syntax documentation is available via the node-semver project at:
    # https://github.com/npm/node-semver/tree/f56505b1c08856a7e6139f6ee5d4580f5f2feed8#ranges
    # **NOTE:** For multiple overrides, ranges should not overlap!
    - versions: '3.0.0'
      # Any top-level property, except `overrides`, is valid.
      # However only the technical details demonstrated below are used by the orchard.
      basePath: https://example.com/random-dependency-you-want/
      es5:
        - /es5.js
      esm:
        - /esm.js
      versionPath: 'v{{version}}'
```
