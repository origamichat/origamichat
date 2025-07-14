# ☁️ Cossistant S3 Upload Infrastructure (Terraform)

This Terraform module creates an S3 bucket for your Cossistant deployment with:

- ✅ Public read access (only via direct URL)
- ✅ Uploads restricted to signed URLs (PutObject only)
- ✅ IAM user and access keys to sign uploads from your backend
- ✅ CORS for frontend uploads
- ✅ Environment-specific resource naming for multi-env deployments

---

## 🔧 Prerequisites

- [Terraform](https://terraform.io/) installed
- AWS credentials configured via `~/.aws/credentials` or environment variables

---

## 🚀 Quick Start

1. Clone the repo and go to the S3 module:

   ```bash
   cd infra/aws/s3-public-setup
   ```

2. Create environment-specific config files:

   **For Development:**

   ```bash
   cp terraform.tfvars.example terraform.dev.tfvars
   ```

   **For Production:**

   ```bash
   cp terraform.tfvars.example terraform.prod.tfvars
   ```

3. Edit your environment files with **globally unique bucket names**:

   **terraform.dev.tfvars:**

   ```hcl
   bucket_name = "cossistant-dev-your-unique-suffix"
   environment = "dev"
   aws_region  = "us-east-1"
   ```

   **terraform.prod.tfvars:**

   ```hcl
   bucket_name = "cossistant-prod-your-unique-suffix"
   environment = "prod"
   aws_region  = "us-east-1"
   ```

4. Initialize Terraform:

   ```bash
   terraform init
   ```

5. Create and use Terraform workspaces for environment isolation:

   ```bash
   # Create dev workspace
   terraform workspace new dev
   terraform workspace select dev

   # Deploy to dev
   terraform apply -var-file="terraform.dev.tfvars"
   ```

   ```bash
   # Create prod workspace
   terraform workspace new prod
   terraform workspace select prod

   # Deploy to prod
   terraform apply -var-file="terraform.prod.tfvars"
   ```

   Type `yes` when prompted for each deployment.

---

## 🔑 Outputs

After apply, Terraform will generate **environment-specific resources**:

- **IAM access key + secret** (e.g., `cossistant-uploader-dev`)
- A **public S3 bucket** for serving files
- **IAM policy** (e.g., `cossistant-upload-policy-dev`)
- Bucket CORS and policy setup

Use the access key + secret in your backend to generate presigned upload URLs.

---

## 🌍 Multiple Environments

This setup supports multiple environments with isolated resources:

| Environment | IAM User                   | IAM Policy                      | Bucket              |
| ----------- | -------------------------- | ------------------------------- | ------------------- |
| **dev**     | `cossistant-uploader-dev`  | `cossistant-upload-policy-dev`  | `cossistant-dev-*`  |
| **prod**    | `cossistant-uploader-prod` | `cossistant-upload-policy-prod` | `cossistant-prod-*` |

### Switching Between Environments

```bash
# Work with dev environment
terraform workspace select dev
terraform plan -var-file="terraform.dev.tfvars"

# Work with prod environment
terraform workspace select prod
terraform plan -var-file="terraform.prod.tfvars"
```

---

## 🌐 Resulting URL Format

Once a file is uploaded via signed URL, it's accessible at:

```
https://<bucket-name>.s3.<region>.amazonaws.com/<key>
```

Example:

- **Dev**: `https://cossistant-dev-mycompany.s3.us-east-1.amazonaws.com/uploads/file.jpg`
- **Prod**: `https://cossistant-prod-mycompany.s3.us-east-1.amazonaws.com/uploads/file.jpg`

---

## ⚠️ Security Note

This setup:

- Allows public `GET` access to exact file URLs
- Does **not** allow listing the bucket
- Only allows **uploads via signed URLs** using the IAM user
- Resources are isolated per environment to prevent conflicts

---

## 🤝 License

MIT — use freely in your own Cossistant setup or forked deployments.
