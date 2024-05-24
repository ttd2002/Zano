module.exports = {
    apps: [
      {
        name: 'app-mobile',
        script: 'npm',
        args: 'start',
        cwd: './app',
        env: {
          NODE_ENV: 'development'
        },
        env_production: {
          NODE_ENV: 'production'
        }
      },
      {
        name: 'web',
        script: 'npm',
        args: 'start',
        cwd: './web',
        env: {
          NODE_ENV: 'development'
        },
        env_production: {
          NODE_ENV: 'production'
        }
      },
      {
        name: 'api',
        script: 'npm',
        args: 'start',
        cwd: './api',
        env: {
          NODE_ENV: 'development'
        },
        env_production: {
          NODE_ENV: 'production'
        }
      }
    ]
  };
  