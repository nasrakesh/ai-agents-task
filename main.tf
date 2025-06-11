
resource "google_artifact_registry_repository" "docker_repo" {
  location      = var.region
  repository_id = var.repo_name
  description   = "Docker repo for capital agent"
  format        = "DOCKER"
}

resource "null_resource" "docker_build" {
  provisioner "local-exec" {
    command = <<EOT
      gcloud builds submit capital-agent \
        --tag=us-central1-docker.pkg.dev/${var.project_id}/${var.repo_name}/capital-agent \
        --project=${var.project_id}
    EOT
  }

  triggers = {
    always_run = timestamp()
  }

  depends_on = [
    google_artifact_registry_repository.docker_repo
  ]
}


resource "google_cloud_run_service" "agent_service" {
  name     = "ai-agent-service"
  location = "us-central1"

  template {
    spec {
      containers {
        image = "us-central1-docker.pkg.dev/${var.project_id}/${var.repo_name}/capital-agent"
        env {
          name  = "AGENT_CONFIG"
          value = "rkteam"
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

resource "google_cloud_run_service_iam_member" "public_invoker" {
  service  = google_cloud_run_service.agent_service.name
  location = google_cloud_run_service.agent_service.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}
