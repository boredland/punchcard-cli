import { build } from 'gluegun';

async function run(argv: string[]) {
    if (!argv[3]) argv.push('tracking');
    const cli = build()
        .brand('punchcard')
        .src(__dirname)
        .plugins('./node_modules', { matching: 'punchcard-*', hidden: true })
        .help()
        .version()
        .exclude(['meta', 'filesystem', 'semver', 'system', 'http', 'template', 'patching', 'package-manager'])
        .create();
    const toolbox = await cli.run(argv);
    return toolbox;
}

module.exports = { run };
