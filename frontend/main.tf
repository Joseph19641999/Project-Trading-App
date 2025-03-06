provider "google" {
  project = var.project_id
  region  = var.region
}


resource "null_resource" "build_and_push" {
  provisioner "local-exec" {
    command = "powershell.exe -File deployement.ps1"
  }

  triggers = {
    always_run = "${timestamp()}"
  }
}
