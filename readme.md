# Punchcard-CLI

Time recording for the command line. Work with your favorite provider or the provider your employer dictates.

## Supported Providers

- absence.io

### Planned Providers

- timesheet.io
- toggl.com

## Usage

- `yarn cli auth absence`
- `yarn cli track start`
- `yarn cli track stop`
- `yarn cli track status`
- `yarn cli track list`

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

