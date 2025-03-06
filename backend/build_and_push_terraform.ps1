# build_push_terraform.ps1

# Variables
$projectID = "boreal-antonym-425218-t7"
$region = "europe-west3"
$repoName = "groupecrepo"
$serviceAccountKeyFile = ".\boreal-antonym.json"
# Authenticate with Google Cloud using the service account
gcloud auth activate-service-account --key-file=./boreal-antonym.json
gcloud config set project $projectID

# Backend
$backendImage = "trading-app-backend:latest"
$backendPath = "."
$backendTag = "$region-docker.pkg.dev/$projectID/$repoName/trading-app:backend-latest"

# Authenticate Docker
gcloud auth configure-docker $region-docker.pkg.dev


# Build and push backend image
docker build -t $backendImage $backendPath
docker tag $backendImage $backendTag
docker push $backendTag

Write-Output "Docker images have been built and pushed successfully."
