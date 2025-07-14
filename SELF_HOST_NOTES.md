# Notes on how to self host as I code this project

## Upstream providers

- Upstash for Redis, QStash and Workflows
- Locally while dev, QStash is emulated and env var are being display in the console every time you start the API
- Files are being stored on AWS s3, an easy terraform setup is available, super fast to setup
- Database is a basic postgres deployed on PlatnetScale, can be dev locally with DBGin for instance and TablePlus
