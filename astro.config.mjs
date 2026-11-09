import { defineConfig } from 'astro/config';

const [owner = '', repositoryName = ''] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
const isGitHubActionsBuild = repositoryName.length > 0;
const isUserSite = repositoryName.endsWith('.github.io');
const isProjectSite = isGitHubActionsBuild && isUserSite === false;

export default defineConfig({
  site: isGitHubActionsBuild ? `https://${owner}.github.io` : undefined,
  base: isProjectSite ? `/${repositoryName}` : '/',
});
