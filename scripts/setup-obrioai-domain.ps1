# Remove DNS parking records and attach obrioai.app to worker obrio-ai.
# Uses CLOUDFLARE_API_TOKENS (DNS Edit) + CLOUDFLARE_API_TOKEN (Workers deploy).

$ErrorActionPreference = "Stop"
$zoneId = "8418b39d45625e8bcd6ef91e78382de4"

function Get-EnvVar($name) {
  $val = [Environment]::GetEnvironmentVariable($name, "Process")
  if ($val) { return $val.Trim() }
  $envFile = Join-Path $PSScriptRoot ".." ".env"
  if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
      if ($_ -match "^\s*$name\s*=\s*(.+)$") { return $matches[1].Trim() }
    }
  }
  return $null
}

$dnsToken = Get-EnvVar "CLOUDFLARE_API_TOKENS"
if (-not $dnsToken) { $dnsToken = Get-EnvVar "CLOUDFLARE_API_TOKEN" }
$workerToken = Get-EnvVar "CLOUDFLARE_API_TOKEN"

if (-not $dnsToken) { Write-Error "Defina CLOUDFLARE_API_TOKENS com Zone DNS Edit." }

$headers = @{ Authorization = "Bearer $dnsToken"; "Content-Type" = "application/json" }

Write-Host "Listando registros DNS..."
$resp = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$zoneId/dns_records?per_page=100" -Headers $headers
$targets = $resp.result | Where-Object {
  ($_.name -eq "obrioai.app" -or $_.name -eq "www.obrioai.app") -and $_.type -in @("A", "AAAA", "CNAME")
}

foreach ($r in $targets) {
  Write-Host "Removendo $($r.type) $($r.name)"
  $del = Invoke-RestMethod -Method Delete -Uri "https://api.cloudflare.com/client/v4/zones/$zoneId/dns_records/$($r.id)" -Headers $headers
  if (-not $del.success) { Write-Error "Falha ao apagar DNS. Token precisa de Zone DNS Edit." }
}

Write-Host "Aplicando custom domains..."
Push-Location (Join-Path $PSScriptRoot "..")
$env:CLOUDFLARE_API_TOKEN = $workerToken
npx wrangler triggers deploy
Pop-Location

Write-Host "Verifique: https://obrioai.app"
