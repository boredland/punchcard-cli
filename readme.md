[![npm version](https://badge.fury.io/js/%40boredland%2Fpunchcard-cli.svg)](https://badge.fury.io/js/%40boredland%2Fpunchcard-cli)
# Punchcard-CLI

[![asciicast](https://asciinema.org/a/4rgRKrfdz1s3lEyddYuiNhj8V.svg)](https://asciinema.org/a/4rgRKrfdz1s3lEyddYuiNhj8V)

Time recording for the command line. Work with your favorite provider or the provider your employer dictates.

## Supported Providers

- absence.io

### Planned Providers

- timesheet.io
- toggl.com

## Install

- your shell profile already should `export PATH="$PATH:$(yarn global bin)"`
- `yarn global add @boredland/punchcard-cli`

### Upgrade

- `yarn global upgrade @boredland/punchcard-cli`

## Usage

- `punchcard-cli auth absence`
- `punchcard-cli track start`
- `punchcard-cli track stop`
- `punchcard-cli track status`
- `punchcard-cli track list`

### Neartime plans

- npmjs release
- add ci
- help menus
- filtering options for `track list`

## Publishing to NPM

To package your CLI up for NPM, do this:

```shell
$ npm login
$ npm whoami
$ npm lint
$ npm test
(if typescript, run `npm run build` here)
$ npm publish
```

# License

MIT - see LICENSE

