resource "aws_ecr_repository" "voice-agent-backend" {
  name = "voice-agent-backend-node"
  image_tag_mutability = "MUTABLE"
  region = "us-east-1"
}