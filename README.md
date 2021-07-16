# Grace Medical Village Clinic

## Environments

### `.env.local`

- Useful defaults for testing with Express.js locally instead of serverless-express.
- Don't commit because `serverless-dotenv-plugin` will automatically include `.env.local` during build

```shell
DATABASE=gmvc
ENDPOINT=http://localhost:8080
NODE_ENV=local
PORT=4000
REGION=us-east-1
RESOURCE_ARN=arn:aws:rds:us-east-1:123456789012:cluster:gmvc
SECRET_ARN=arn:aws:secretsmanager:us-east-1:123456789012:secret:gmvc
STAGE=local
```
