# Inicia o AssetPilot sem armazenar a senha em arquivos.
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host 'Node.js nao encontrado. Instale o Node.js 20 ou superior.' -ForegroundColor Red
    Read-Host 'Pressione Enter para sair'
    exit 1
}

$senhaSegura = Read-Host 'Digite uma senha de administrador (minimo 12 caracteres)' -AsSecureString
$ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($senhaSegura)
try {
    $env:ADMIN_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
} finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
    $senhaSegura.Dispose()
}

if ($env:ADMIN_PASSWORD.Length -lt 12) {
    Remove-Item Env:ADMIN_PASSWORD -ErrorAction SilentlyContinue
    Write-Host 'A senha deve conter pelo menos 12 caracteres.' -ForegroundColor Red
    Read-Host 'Pressione Enter para sair'
    exit 1
}

Write-Host 'Iniciando AssetPilot em http://127.0.0.1:3334' -ForegroundColor Green
Write-Host 'Mantenha esta janela aberta. Pressione Ctrl+C para encerrar.'
try {
    node (Join-Path $PSScriptRoot 'server.mjs')
} finally {
    Remove-Item Env:ADMIN_PASSWORD -ErrorAction SilentlyContinue
}
