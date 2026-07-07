output "repository_url" {
  value = aws_ecr_repository.voice-agent-backend.repository_url
}

output "alb_dns_name" {
  value       = aws_lb.voice_agent_alb.dns_name
  description = "The public DNS name of the ALB to test the application"
}