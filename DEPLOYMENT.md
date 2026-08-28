# Vercel deployment

The GitHub Actions workflow in `.github/workflows/deploy-vercel.yml` builds and
deploys the application to Vercel whenever `main` receives a new commit. It can
also be started manually from the Actions tab.

## Required GitHub Actions secrets

Add these repository secrets under **Settings → Secrets and variables → Actions**:

- `VERCEL_TOKEN`: a Vercel access token with permission to deploy the project.
- `VERCEL_ORG_ID`: copy `orgId` from the local `.vercel/project.json` file.
- `VERCEL_PROJECT_ID`: copy `projectId` from the local `.vercel/project.json` file.

The `.vercel` directory is intentionally ignored by Git. Do not commit the token
or application environment variables. Configure application variables in the
Vercel project's Production environment; `vercel pull` makes them available to
the CI build.
