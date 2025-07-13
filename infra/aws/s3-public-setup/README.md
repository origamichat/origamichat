# ☁️ Cossistant S3 Upload Infrastructure (Terraform)

This Terraform module creates an S3 bucket for your Cossistant deployment with:

- ✅ Public read access (only via direct URL)
- ✅ Uploads restricted to signed URLs (PutObject only)
- ✅ IAM user and access keys to sign uploads from your backend
- ✅ CORS for frontend uploads

---

## 🔧 Prerequisites

- [Terraform](https://terraform.io/) installed
- AWS credentials configured via `~/.aws/credentials` or environment variables

---

## 🚀 Quick Start

1. Clone the repo and go to the S3 module:

   ```bash
   cd infra/aws/s3-public-upload
   ```

2. Copy the example config:

   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

3. Edit `terraform.tfvars` and set a **globally unique bucket name**.

4. Initialize Terraform:

   ```bash
   terraform init
   ```

5. Apply the config:

   ```bash
   terraform apply
   ```

   Type `yes` when prompted.

---

## 🔑 Outputs

After apply, Terraform will generate:

- **IAM access key + secret** for uploading
- A **public S3 bucket** for serving files
- Bucket CORS and policy setup

Use the access key + secret in your backend to generate presigned upload URLs.

---

## 🌍 Resulting URL Format

Once a file is uploaded via signed URL, it’s accessible at:

```
https://<bucket-name>.s3.<region>.amazonaws.com/<key>
```

---

## ⚠️ Security Note

This setup:

- Allows public `GET` access to exact file URLs
- Does **not** allow listing the bucket
- Only allows **uploads via signed URLs** using the IAM user

---

## 🤝 License

MIT — use freely in your own Cossistant setup or forked deployments.
