# undeploy.sh
#!/bin/bash

# Destroy the Terraform-managed infrastructure
terraform destroy -auto-approve
