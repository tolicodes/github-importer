const execSync = require('child_process').execSync;
const fs = require('fs');
const fetch = require('node-fetch');
const {
  GITHUB_TOKEN
} = process.env;

const repos = fs.readdirSync('../', {
  withFileTypes: true
});

repos
  .filter(dir => dir.isDirectory())
  .map(dir => dir.name)
  .forEach(async (repo) => {
    const fetchResult = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        Authorization: `Token ${GITHUB_TOKEN}`
      },
      body: JSON.stringify({
        name: repo,
        private: true,
      })
    });

    console.log(await fetchResult.json());

    const out = execSync(`
      cd ../${repo}
      git init
      git add .
      git commit -m "init"
      git remote add import git@github.com:tolicodes/${repo}.git
      git push import master
    `);

    console.log(out.toString())
  });