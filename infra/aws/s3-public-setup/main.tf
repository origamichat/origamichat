# Minimal S3 setup for Cossistant
# Allows: public read (if exact URL), uploads only via signed URLs

provider "aws" {
  region = var.aws_region
}

variable "bucket_name" {
  description = "Name of the S3 bucket"
  type        = string
}

variable "aws_region" {
  description = "AWS region to deploy in"
  default     = "eu-west-1"
}

resource "aws_s3_bucket" "cossistant" {
  bucket = var.bucket_name
  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "cossistant" {
  bucket = aws_s3_bucket.cossistant.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "public_read" {
  bucket = aws_s3_bucket.cossistant.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid:       "AllowPublicRead",
        Effect:    "Allow",
        Principal: "*",
        Action:    "s3:GetObject",
        Resource:  "${aws_s3_bucket.cossistant.arn}/*"
      }
    ]
  })
}

resource "aws_s3_bucket_cors_configuration" "cors" {
  bucket = aws_s3_bucket.cossistant.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
}

# IAM user with PutObject permissions
resource "aws_iam_user" "cossistant_uploader" {
  name = "cossistant-uploader"
}

resource "aws_iam_policy" "cossistant_upload_policy" {
  name = "cossistant-upload-policy"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect: "Allow",
        Action: ["s3:PutObject"],
        Resource: "${aws_s3_bucket.cossistant.arn}/*"
      }
    ]
  })
}

resource "aws_iam_user_policy_attachment" "upload_policy_attach" {
  user       = aws_iam_user.cossistant_uploader.name
  policy_arn = aws_iam_policy.cossistant_upload_policy.arn
}

resource "aws_iam_access_key" "uploader_key" {
  user = aws_iam_user.cossistant_uploader.name
}
