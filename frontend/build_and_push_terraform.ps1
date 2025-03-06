# build_push_terraform.ps1

# Variables
$projectID = "boreal-antonym-425218-t7"
$region = "europe-west3"
$repoName = "groupecrepo"
$serviceAccountKeyFile = ".\boreal-antonym.json"

# Authenticate with Google Cloud using the service account
gcloud auth activate-service-account --key-file=./boreal-antonym.json
gcloud config set project $projectID

# Frontend

$frontendImage = "trading-app-frontend:latest"
$frontendPath = "./Trading"
$frontendTag = "$region-docker.pkg.dev/$projectID/$repoName/trading-app:frontend-latest"


# Authenticate Docker
gcloud auth configure-docker $region-docker.pkg.dev

# Build and push frontend image
set NODE_OPTIONS=--max_old_space_size=8192
docker build -t $frontendImage $frontendPath
docker tag $frontendImage $frontendTag
docker push $frontendTag


Write-Output "Docker images have been built and pushed successfully."
