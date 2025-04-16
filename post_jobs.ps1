$markets = @(
    "nvidia-3060",
    "nvidia-4060",
    "nvidia-3070",
    "nvidia-4070",
    "nvidia-3080",
    "nvidia-4000",
    "nvidia-4080",
    "nvidia-3090",
    "nvidia-5070",
    "nvidia-5000",
    "nvidia-4090",
    "nvidia-5080",
    "nvidia-5090",
    "nvidia-6000",
    "nvidia-a40",
    "nvidia-a100-40gb",
    "nvidia-a100-80gb",
    "nvidia-h100"
)

Write-Host "Starting to post jobs to all markets..."
Write-Host "----------------------------------------"

foreach ($market in $markets) {
    Write-Host "Posting job to market: $market"
    nosana job post --market $market -f test_new_pytorch.json -t 120
    Write-Host "----------------------------------------"
}

Write-Host "Job posting complete!" 