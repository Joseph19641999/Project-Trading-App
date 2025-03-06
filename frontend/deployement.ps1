# build_push_terraform.ps1

# Variables
$projectID = "boreal-antonym-425218-t7"
$region = "europe-west3"
$repoName = "groupecrepo"
$serviceAccountKeyFile = "./boreal-antonym.json" # The service account key file in the same directory

# Authenticate with Google Cloud using the service account
gcloud auth activate-service-account --key-file=$serviceAccountKeyFile
gcloud config set project $projectID

# Frontend
$backendImage = "trading-app-frontend:latest"
$backendPath = "./Trading"
$backendTag = "$region-docker.pkg.dev/$projectID/$repoName/trading-app:frontend-latest"
$backendServiceName = "xboerse-de"


# Authenticate Docker
gcloud auth configure-docker $region-docker.pkg.dev

# Build and push backend image
docker build -t $backendImage $backendPath
docker tag $backendImage $backendTag
docker push $backendTag

Write-Output "Docker images have been built and pushed successfully."

# Deploy to Cloud Run
Write-Output "Deploying backend service to Cloud Run..."
gcloud beta run services add-iam-policy-binding --region=europe-west3 --member=allUsers --role=roles/run.invoker xboerse-de

gcloud run deploy $backendServiceName `
  --image $backendTag `
  --region $region `
  --platform managed `
  --allow-unauthenticated `
  --port 8080 `



