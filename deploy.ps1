# deploy.ps1
# Script de automação para compilação, push da imagem Docker e deploy do Terraform para a AWS.

$AWS_REGION = "sa-east-1"
$AWS_ACCOUNT_ID = "628732879443"
$ECR_REPO_NAME = "voice-agent-backend-node"
$ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
$IMAGE_TAG = "latest"

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  Iniciando Deploy do Voice Agent no AWS    " -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# 1. Verificar se o Docker está rodando
Write-Host "1. Verificando o estado do Docker daemon..." -ForegroundColor Yellow
& docker ps > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Error "O Docker Daemon não está respondendo. Certifique-se de que o Docker Desktop está aberto e rodando com privilégios de administrador."
    exit 1
}
Write-Host "Docker está rodando corretamente." -ForegroundColor Green

# 2. Login no ECR
Write-Host "2. Autenticando com o Amazon ECR na região $AWS_REGION..." -ForegroundColor Yellow
$loginPassword = aws ecr get-login-password --region $AWS_REGION
if ($LASTEXITCODE -ne 0) {
    Write-Error "Falha ao obter senha de login do ECR via AWS CLI. Verifique suas credenciais da AWS."
    exit 1
}

$loginPassword | docker login --username AWS --password-stdin $ECR_REGISTRY
if ($LASTEXITCODE -ne 0) {
    Write-Error "Falha na autenticação do Docker com o ECR."
    exit 1
}
Write-Host "Autenticação no ECR concluída com sucesso." -ForegroundColor Green

# 3. Build da Imagem Docker
Write-Host "3. Compilando a imagem Docker..." -ForegroundColor Yellow
docker build -t $ECR_REPO_NAME .
if ($LASTEXITCODE -ne 0) {
    Write-Error "Erro ao compilar a imagem Docker."
    exit 1
}
Write-Host "Imagem Docker compilada com sucesso." -ForegroundColor Green

# 4. Tagging
Write-Host "4. Taggeando a imagem para o ECR..." -ForegroundColor Yellow
docker tag "${ECR_REPO_NAME}:${IMAGE_TAG}" "${ECR_REGISTRY}/${ECR_REPO_NAME}:${IMAGE_TAG}"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Erro ao taggear a imagem Docker."
    exit 1
}

# 5. Push para o ECR
Write-Host "5. Fazendo push da imagem Docker para o ECR..." -ForegroundColor Yellow
docker push "${ECR_REGISTRY}/${ECR_REPO_NAME}:${IMAGE_TAG}"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Erro ao enviar imagem ao ECR."
    exit 1
}
Write-Host "Imagem enviada ao ECR com sucesso." -ForegroundColor Green

# 6. Terraform Apply
Write-Host "6. Aplicando configurações do Terraform na pasta ./terraform..." -ForegroundColor Yellow
cd terraform

Write-Host "Inicializando Terraform..." -ForegroundColor Gray
terraform init
if ($LASTEXITCODE -ne 0) {
    Write-Error "Erro ao inicializar o Terraform."
    cd ..
    exit 1
}

Write-Host "Aplicando a infraestrutura no AWS (isso pode levar alguns minutos)..." -ForegroundColor Gray
terraform apply -auto-approve
if ($LASTEXITCODE -ne 0) {
    Write-Error "Erro ao aplicar o Terraform."
    cd ..
    exit 1
}

$ALB_DNS = terraform output -raw alb_dns_name
cd ..

Write-Host "=============================================" -ForegroundColor Green
Write-Host "  Deploy realizado com sucesso!            " -ForegroundColor Green
Write-Host "  Endpoint para teste:                     " -ForegroundColor Green
Write-Host "  http://$ALB_DNS/health                   " -ForegroundColor Green
Write-Host "  POST http://$ALB_DNS/voice-interaction   " -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
