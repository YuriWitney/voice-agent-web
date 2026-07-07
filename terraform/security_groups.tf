resource "aws_security_group" "alb_sg" {
  name        = "voice-agent-alb-sg"
  description = "Allow public HTTP traffic to ALB"
  vpc_id      = aws_vpc.voice_agent_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "voice-agent-alb-sg"
  }
}

resource "aws_security_group" "ecs_sg" {
  name        = "voice-agent-ecs-sg"
  description = "Allow traffic from ALB to ECS container on port 3333"
  vpc_id      = aws_vpc.voice_agent_vpc.id

  ingress {
    from_port       = 3333
    to_port         = 3333
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "voice-agent-ecs-sg"
  }
}
