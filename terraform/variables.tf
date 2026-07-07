variable "aws_region" {
  type        = string
  default     = "sa-east-1"
  description = "AWS region for deployment"
}

variable "elevenlabs_api_key" {
  type        = string
  sensitive   = true
  description = "Elevenlabs API key for TTS"
}

variable "groq_api_key" {
  type        = string
  sensitive   = true
  description = "Groq API key for STT and LLM"
}
