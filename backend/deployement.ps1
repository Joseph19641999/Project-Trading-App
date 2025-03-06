# build_push_terraform.ps1

# Variables
$projectID = "boreal-antonym-425218-t7"
$region = "europe-west3"
$repoName = "groupecrepo"
$serviceAccountKeyFile = "./boreal-antonym.json" # The service account key file in the same directory
$databaseUrl = "boreal-antonym-425218-t7:europe-west3:postgresdb"

# Authenticate with Google Cloud using the service account
gcloud auth activate-service-account --key-file=$serviceAccountKeyFile
gcloud config set project $projectID

# Backend
$backendImage = "trading-app-backend:latest"
$backendPath = "."
$backendTag = "$region-docker.pkg.dev/$projectID/$repoName/trading-app:backend-latest"
$backendServiceName1 = "test-backend"
$backendServiceName2 = "backend-server-ws"


# Authenticate Docker
gcloud auth configure-docker $region-docker.pkg.dev

# Build and push backend image
docker build -t $backendImage $backendPath
docker tag $backendImage $backendTag
docker push $backendTag

Write-Output "Docker images have been built and pushed successfully."

# Deploy to Cloud Run
Write-Output "Deploying backend service to Cloud Run..."
gcloud run deploy $backendServiceName1 `
  --image $backendTag `
  --region $region `
  --platform managed `
  --allow-unauthenticated `
  --port 3000 `
  --set-env-vars "DATABASE_URL=$databaseUrl"

  gcloud run deploy $backendServiceName2 `
    --image $backendTag `
    --region $region `
    --platform managed `
    --allow-unauthenticated `
    --port 8081 `
    --set-env-vars "DATABASE_URL=$databaseUrl"

