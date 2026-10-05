# CI (.github/workflows/deploy.yml) builds the image on the Nomad host with a
# per-commit tag and passes it in via `-var image=...`, so every push to main
# rolls out a new allocation. Manual runs without -var keep the old tag.
variable "image" {
  type    = string
  default = "auraplex.local/website:v1"
}

job "website" {
  datacenters = ["dmz"]
  type        = "service"
  priority    = 80

  group "web" {
    count = 1

    network {
      mode = "host"
    }

    restart {
      attempts = 5
      interval = "5m"
      delay    = "15s"
      mode     = "delay"
    }

    # Host networking pins port 3000, so old and new allocations can't run
    # side by side: the old one stops, the new one must pass the healthz
    # check, and a failed rollout reverts to the last healthy version.
    update {
      max_parallel      = 1
      health_check      = "checks"
      min_healthy_time  = "20s"
      healthy_deadline  = "4m"
      progress_deadline = "6m"
      auto_revert       = true
    }

    task "next" {
      driver = "docker"

      config {
        image        = var.image
        network_mode = "host"
      }

      env {
        NODE_ENV                     = "production"
        PORT                         = "3000"
        HOSTNAME                     = "0.0.0.0"
        NEXT_PUBLIC_SITE_URL         = "https://www.auraplex.info"
        NEXT_PUBLIC_CHAT_API_URL     = "https://chat-api.auraplex.info"
        NEXT_PUBLIC_PLAUSIBLE_DOMAIN = "auraplex.info"
      }

      # Runtime secrets from the Nomad variable at nomad/jobs/website, e.g.
      #   nomad var put nomad/jobs/website RESEND_API_KEY=re_...
      # Without the variable the site still runs; the forms report "send failed".
      template {
        destination = "secrets/app.env"
        env         = true
        change_mode = "restart"
        data        = <<-EOT
          {{- if nomadVarExists "nomad/jobs/website" -}}
          {{- with nomadVar "nomad/jobs/website" -}}
          {{- range .Tuples }}
          {{ .K }}={{ .V | toJSON }}
          {{- end }}
          {{- end -}}
          {{- end }}
        EOT
      }

      resources {
        cpu    = 1000
        memory = 1024
      }
    }

    service {
      name     = "auraplex-website"
      provider = "consul"
      port     = "3000"
      tags     = ["public", "next"]

      check {
        name     = "healthz"
        type     = "http"
        path     = "/en"
        port     = "3000"
        interval = "30s"
        timeout  = "5s"
      }
    }
  }
}
