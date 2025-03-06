variable "project_id" {
  description = "The ID of the GCP project"
  type        = string
}

variable "region" {
  description = "The region to deploy resources"
  type        = string
  default     = "europe-west3"
}

variable "repo_name" {
  description = "The name of the Google Artifact Registry repository"
  type        = string
}
